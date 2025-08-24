// const OrderModel = require('../models/orderModel');

// /** GET /api/orders/user/:id */
// exports.getOrdersByUser = async (req, res) => {
//   try {
//     const id = Number(req.params.id);
//     if (!Number.isInteger(id) || id <= 0) {
//       return res.status(400).json({ error: 'Invalid user id' });
//     }

//     const orders = await OrderModel.findByUserId(id);
//     return res.json(orders);
//   } catch (err) {
//     console.error("getOrdersByUser error:", err);
//     return res.status(500).json({ error: 'Failed to fetch orders' });
//   }
// };


const OrderModel = require('../models/orderModel');

exports.getOrdersByUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const rows = await OrderModel.findByUserId(id);

    // קיבוץ התוצאות לפי הזמנה
    const ordersMap = {};
    rows.forEach(r => {
      if (!ordersMap[r.order_id]) {
        ordersMap[r.order_id] = {
          id: r.order_id,
          order_date: r.order_date,
          status: r.status,
          total_price: r.total_price,
          items: []
        };
      }
      if (r.item_id) {
        ordersMap[r.order_id].items.push({
          id: r.item_id,
          dish_name: r.dish_name,
          quantity: r.quantity,
          price: r.price
        });
      }
    });

    const orders = Object.values(ordersMap);
    res.json(orders);
  } catch (err) {
    console.error("getOrdersByUser error:", err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
