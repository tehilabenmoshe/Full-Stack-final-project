// server/src/models/cartModel.js
const pool = require('../db_connection');

async function ensurePendingOrder(conn, userId) {
  const [rows] = await conn.query(
    `SELECT id FROM orders
      WHERE user_id = ? AND status = 'pending'
      ORDER BY id DESC LIMIT 1`,
    [userId]
  );
  if (rows[0]) return rows[0].id;

  const [ins] = await conn.query(
    `INSERT INTO orders (user_id, status, total_price)
     VALUES (?, 'pending', 0)`,
    [userId]
  );
  return ins.insertId;
}

function safeParse(json) {
  try { return json ? JSON.parse(json) : null; }
  catch { return null; }
}

const cartModel = {
  /** הוספת פריט לסל (יוצר הזמנה pending אם צריך) */
  async addToCart(userId, { dishId, qty = 1, addons = [], note = '' }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // בדיקת מנה + מחיר
      const [[dish]] = await conn.query(
        `SELECT id, price FROM dishes WHERE id = ?`,
        [dishId]
      );
      if (!dish) throw Object.assign(new Error('Dish not found'), { status: 404 });

      const unitPrice = Number(dish.price);
      const lineTotal = unitPrice * Number(qty);

      // הזמנה פתוחה
      const orderId = await ensurePendingOrder(conn, userId);

      // שורת סל
      const notesObj = { addons: Array.isArray(addons) ? addons : [], note: note || '' };
      let orderItemId;
      try {
        const [insItem] = await conn.query(
          `INSERT INTO order_items (order_id, dish_id, quantity, price, notes)
           VALUES (?, ?, ?, ?, ?)`,
          [orderId, dishId, qty, unitPrice, JSON.stringify(notesObj)]
        );
        orderItemId = insItem.insertId;
      } catch (e) {
        // אם אין עמודת notes – fallback
        if (e.code === 'ER_BAD_FIELD_ERROR') {
          const [insItem] = await conn.query(
            `INSERT INTO order_items (order_id, dish_id, quantity, price)
             VALUES (?, ?, ?, ?)`,
            [orderId, dishId, qty, unitPrice]
          );
          orderItemId = insItem.insertId;
        } else {
          throw e;
        }
      }

      // עדכון סה"כ בהזמנה
      await conn.query(
        `UPDATE orders
            SET total_price = COALESCE(total_price,0) + ?
          WHERE id = ?`,
        [lineTotal, orderId]
      );

      await conn.commit();
      return { orderId, orderItemId, unitPrice, lineTotal };
    } catch (err) {
      try { await conn.rollback(); } catch {}
      throw err;
    } finally {
      conn.release();
    }
  },

  /** סל נוכחי (pending) למשתמש */
  async getCart(userId) {
    const [[ord]] = await pool.query(
      `SELECT id, total_price
         FROM orders
        WHERE user_id = ? AND status = 'pending'
        ORDER BY id DESC LIMIT 1`,
      [userId]
    );
    if (!ord) return { orderId: null, items: [], total: 0 };

    const [items] = await pool.query(
      `SELECT oi.id, oi.dish_id, d.name, oi.quantity,
              oi.price AS unit_price,
              (oi.quantity * oi.price) AS line_total,
              oi.note
         FROM order_items oi
         JOIN dishes d ON d.id = oi.dish_id
        WHERE oi.order_id = ?
        ORDER BY oi.id DESC`,
      [ord.id]
    );

    return {
      orderId: ord.id,
      items: items.map(it => ({
        ...it,
        unit_price: Number(it.unit_price),
        line_total: Number(it.line_total),
        notes: safeParse(it.notes),
      })),
      total: Number(ord.total_price || 0),
    };
  },

  /** עדכון כמות לשורת סל (qty=0 → מחיקה) */
  async updateItemQty(userId, itemId, qty) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [[row]] = await conn.query(
        `SELECT oi.id, oi.order_id, oi.quantity, oi.price,
                o.user_id, o.status
           FROM order_items oi
           JOIN orders o ON o.id = oi.order_id
          WHERE oi.id = ? AND o.user_id = ? AND o.status = 'pending'
          LIMIT 1`,
        [itemId, userId]
      );
      if (!row) throw Object.assign(new Error('Item not found'), { status: 404 });

      const oldQty = Number(row.quantity);
      const deltaQty = Number(qty) - oldQty; // יכול להיות שלילי
      const deltaTotal = deltaQty * Number(row.price);

      if (Number(qty) === 0) {
        await conn.query(`DELETE FROM order_items WHERE id = ?`, [itemId]);
      } else {
        await conn.query(`UPDATE order_items SET quantity = ? WHERE id = ?`, [qty, itemId]);
      }

      await conn.query(
        `UPDATE orders SET total_price = COALESCE(total_price,0) + ? WHERE id = ?`,
        [deltaTotal, row.order_id]
      );

      await conn.commit();
      return { ok: true };
    } catch (err) {
      try { await conn.rollback(); } catch {}
      throw err;
    } finally {
      conn.release();
    }
  },

  
  /** מחיקת שורת סל */
  async removeItem(userId, itemId) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [[row]] = await conn.query(
        `SELECT oi.order_id, oi.quantity, oi.price
           FROM order_items oi
           JOIN orders o ON o.id = oi.order_id
          WHERE oi.id = ? AND o.user_id = ? AND o.status = 'pending'`,
        [itemId, userId]
      );
      if (!row) throw Object.assign(new Error('Item not found'), { status: 404 });

      const lineTotal = Number(row.quantity) * Number(row.price);

      await conn.query(`DELETE FROM order_items WHERE id = ?`, [itemId]);
      await conn.query(
        `UPDATE orders SET total_price = COALESCE(total_price,0) - ? WHERE id = ?`,
        [lineTotal, row.order_id]
      );

      await conn.commit();
      return { ok: true };
    } catch (err) {
      try { await conn.rollback(); } catch {}
      throw err;
    } finally {
      conn.release();
    }
  },


  /** ריקון כל הסל של המשתמש (ההזמנה ה־pending) */
  async clearCart(userId) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [[ord]] = await conn.query(
        `SELECT id FROM orders
          WHERE user_id=? AND status='pending'
          ORDER BY id DESC LIMIT 1`,
        [userId]
      );

      if (!ord) {
        await conn.commit();
        return { cleared: false, orderId: null, removed: 0 };
      }

      const [del] = await conn.query(
        `DELETE FROM order_items WHERE order_id=?`,
        [ord.id]
      );

      await conn.query(
        `UPDATE orders SET total_price=0 WHERE id=?`,
        [ord.id]
      );

      await conn.commit();
      return { cleared: true, orderId: ord.id, removed: del.affectedRows };
    } catch (err) {
      try { await conn.rollback(); } catch {}
      throw err;
    } finally {
      conn.release();
    }
  },
};

module.exports = cartModel;
