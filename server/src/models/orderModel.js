const pool = require('../db_connection');

// ─────────────  Getters  ─────────────
async function getPendingOrderForUser(conn, userId) {
  const [[row]] = await conn.query(
    `SELECT id FROM orders WHERE user_id=? AND status='pending' ORDER BY id DESC LIMIT 1`,
    [userId]
  );
  return row || null;
}

async function getOrderByIdForUser(conn, orderId, userId) {
  const [[row]] = await conn.query(
    `SELECT id, user_id, status, total_price, payment_method, payment_ref
     FROM orders
     WHERE id=? AND user_id=?`,
    [orderId, userId]
  );
  return row || null;
}

async function getOrderTotal(conn, orderId) {
  const [[row]] = await conn.query(
    `SELECT COALESCE(SUM(quantity*price),0) AS total
     FROM order_items WHERE order_id=?`,
    [orderId]
  );
  return Number(row?.total || 0);
}

// ─────────────  Mutations  ─────────────
async function updateOrderMeta(conn, orderId, { total, address, paymentMethod }) {
  return conn.query(
    `UPDATE orders
     SET total_price=?, delivery_address=?, payment_method=?
     WHERE id=?`,
    [total, address ? JSON.stringify(address) : null, paymentMethod || null, orderId]
  );
}

async function markOrderPaid(conn, orderId, paymentRef) {
  return conn.query(
    `UPDATE orders SET status='paid', payment_ref=? WHERE id=?`,
    [paymentRef, orderId]
  );
}

async function setPaymentRef(conn, orderId, paymentRef) {
  return conn.query(
    `UPDATE orders SET payment_ref=? WHERE id=?`,
    [paymentRef, orderId]
  );
}

module.exports = {
  pool, // לשימוש לפתיחת conn ב־route
  getPendingOrderForUser,
  getOrderByIdForUser,
  getOrderTotal,
  updateOrderMeta,
  markOrderPaid,
  setPaymentRef,
};

const OrderModel = {
  // שליפת כל ההזמנות של משתמש כולל הפריטים בכל הזמנה
  async findByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT o.id AS order_id, o.order_date, o.status, o.total_price,
              oi.id AS item_id, oi.quantity, oi.price,
              d.name AS dish_name
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN dishes d ON oi.dish_id = d.id
       WHERE o.user_id = ?
       ORDER BY o.order_date DESC`,
      [userId]
    );
    return rows;
  }
};

module.exports = OrderModel;
