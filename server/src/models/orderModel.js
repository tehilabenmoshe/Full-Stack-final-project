// const pool = require('../db_connection')
// const OrderModel = {
//   // שליפת כל ההזמנות של משתמש לפי user_id
//   async findByUserId(userId) {
//     const [rows] = await pool.query(
//       "SELECT id, order_date, status, total_price FROM orders WHERE user_id = ? ORDER BY order_date DESC",
//       [userId]
//     );
//     return rows;
//   }
  
// };

// module.exports = OrderModel;

const pool = require('../db_connection');

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
