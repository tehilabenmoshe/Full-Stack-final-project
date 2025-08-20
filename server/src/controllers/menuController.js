const MenuModel = require('../models/menuModel');

exports.getCategories = async (_req, res) => {
  try {
    const cats = await MenuModel.getCategories();
    res.json(cats);
  } catch (e) {
    console.error('getCategories error:', e);
    res.status(500).json({ error: 'Failed to load categories' });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) return res.status(400).json({ error: 'categoryId is required' });
    const items = await MenuModel.getItems(Number(categoryId));
    res.json(items);
  } catch (e) {
    console.error('getItems error:', e);
    res.status(500).json({ error: 'Failed to load items' });
  }
};

exports.search = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);
    const rows = await MenuModel.searchItems(q);
    res.json(rows);
  } catch (e) {
    console.error('search error:', e);
    res.status(500).json({ error: 'Failed to search items' });
  }
};
