// server/src/controllers/cartController.js
const Cart = require('../models/cartModel');

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { dishId, qty = 1, addons = [], note = '' } = req.body || {};
    if (!dishId || qty < 1) return res.status(400).json({ error: 'dishId and qty>=1 are required' });

    const result = await Cart.addToCart(userId, { dishId: Number(dishId), qty: Number(qty), addons, note });
    res.status(201).json({ ok: true, ...result });
  } catch (err) {
    const status = err.status || 500;
    console.error('addToCart error:', err.code || '', err.sqlMessage || err.message);
    res.status(status).json({ error: err.message || 'Failed to add to cart' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const cart = await Cart.getCart(userId);
    res.json(cart);
  } catch (err) {
    console.error('getCart error:', err);
    res.status(500).json({ error: 'Failed to load cart' });
  }
};

exports.updateItemQty = async (req, res) => {
  try {
    const userId = req.user?.id;
    const itemId = Number(req.params.id);
    const { qty } = req.body || {};
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!itemId || qty === undefined) return res.status(400).json({ error: 'item id and qty are required' });

    await Cart.updateItemQty(userId, itemId, Number(qty));
    res.json({ ok: true });
  } catch (err) {
    const status = err.status || 500;
    console.error('updateItemQty error:', err);
    res.status(status).json({ error: err.message || 'Failed to update item' });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    const itemId = Number(req.params.id);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!itemId) return res.status(400).json({ error: 'item id is required' });

    await Cart.removeItem(userId, itemId);
    res.json({ ok: true });
  } catch (err) {
    const status = err.status || 500;
    console.error('removeItem error:', err);
    res.status(status).json({ error: err.message || 'Failed to remove item' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const result = await Cart.clearCart(userId); // { cleared, orderId, removed }
    return res.json({ ok: true, ...result });
  } catch (err) {
    console.error('clearCart error:', err);
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Failed to clear cart' });
  }
};
