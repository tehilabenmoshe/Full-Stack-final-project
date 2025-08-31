// server/src/services/payment.service.js
// כאן מחליפים בהטמעה אמיתית (Stripe/Tranzilla/Bit וכו').
async function chargeCard({ amount, card }) {
  // עשי ולידציה בסיסית אם תרצי...
  return { ok: true, ref: 'CARD_TEST_' + Date.now() };
}

async function createBitPayment({ amount }) {
  const ref = 'BIT_TEST_' + Date.now();
  const redirectUrl = `https://example.com/bit/pay/${ref}`; // החליפי ל־URL אמיתי
  return { ok: true, ref, redirectUrl };
}

module.exports = { chargeCard, createBitPayment };
