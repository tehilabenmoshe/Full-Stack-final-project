// server/src/routes/checkout.routes.js
const router = require('express').Router();
const auth = require('../middleware/auth');                // ממלא req.user.id
const {
  pool,
  getPendingOrderForUser,
  getOrderByIdForUser,
  getOrderTotal,
  updateOrderMeta,
  markOrderPaid,
  setPaymentRef,
} = require('../models/orderModel');
const pay = require('../services/payment');

router.post('/checkout', auth, async (req, res) => {
  const userId = req.user.id;
  const { orderId, address, paymentMethod, card } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // אם לא נשלח orderId – נאתר pending קיים למשתמש
    let ord = orderId
      ? await getOrderByIdForUser(conn, orderId, userId)
      : await getPendingOrderForUser(conn, userId);

    if (!ord || ord.status !== 'pending')
      throw new Error('Order not found or not pending');

    const realOrderId = ord.id;

    // חישוב סה״כ בצד שרת
    const total = await getOrderTotal(conn, realOrderId);

    // עדכון מטא־דאטה (כתובת/שיטה)
    await updateOrderMeta(conn, realOrderId, {
      total,
      address,
      paymentMethod,
    });

    let paymentRef = null;
    let redirectUrl = null;

    if (paymentMethod === 'card') {
      const result = await pay.chargeCard({ amount: total, card });
      if (!result.ok) throw new Error('Card payment failed');
      paymentRef = result.ref;
      await markOrderPaid(conn, realOrderId, paymentRef);
    } else if (paymentMethod === 'bit') {
      const result = await pay.createBitPayment({ amount: total });
      if (!result.ok) throw new Error('Bit payment init failed');
      paymentRef = result.ref;
      redirectUrl = result.redirectUrl;
      await setPaymentRef(conn, realOrderId, paymentRef);
      // סטטוס ל-paid יעודכן ב־webhook/Callback אמיתי
    } else {
      throw new Error('Unknown payment method');
    }

    await conn.commit();
    res.json({ ok: true, orderId: realOrderId, paymentRef, redirectUrl });
  } catch (e) {
    await conn.rollback();
    console.error('checkout error:', e);
    res.status(400).json({ message: e.message || 'Checkout failed' });
  } finally {
    conn.release();
  }
});

module.exports = router;
