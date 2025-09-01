
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

// exports.getItems = async (req, res) => {
//   try {
//     const { categoryId } = req.query;
//     if (!categoryId) return res.status(400).json({ error: 'categoryId is required' });
//     const items = await MenuModel.getItems(Number(categoryId));
//     res.json(items);
//   } catch (e) {
//     console.error('getItems error:', e);
//     res.status(500).json({ error: 'Failed to load items' });
//   }
// };
exports.getItems = async (req, res) => {
  try {
    const { categoryId } = req.query;
    let items;

    if (categoryId) {
      // אם יש categoryId -> נביא מנות רק מהקטגוריה הזו
      items = await MenuModel.getItems(Number(categoryId));
    } else {
      // אם אין categoryId -> נביא את כל המנות
      items = await MenuModel.getAllItems();
    }

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

// --- נוסיף עכשיו פונקציות לניהול (Admin בלבד) ---

// קטגוריות
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const id = await MenuModel.createCategory({ name, description, image_url });
    res.status(201).json({ id, name, description, image_url });
  } catch (e) {
    console.error('createCategory error:', e);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid category id' });

    const ok = await MenuModel.updateCategory(id, req.body);
    if (!ok) return res.status(404).json({ error: 'Category not found' });

    res.json({ success: true });
  } catch (e) {
    console.error('updateCategory error:', e);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid category id' });

    const ok = await MenuModel.deleteCategory(id);
    if (!ok) return res.status(404).json({ error: 'Category not found' });

    res.json({ success: true });
  } catch (e) {
    console.error('deleteCategory error:', e);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

// פריטים (מנות)
exports.createItem = async (req, res) => {
  try {
    const { name, description, price, category_id, image_url } = req.body;
    if (!name || !price || !category_id) {
      return res.status(400).json({ error: 'name, price and category_id are required' });
    }

    const id = await MenuModel.createItem({ name, description, price, category_id, image_url });
    res.status(201).json({ id, name, description, price, category_id, image_url });
  } catch (e) {
    console.error('createItem error:', e);
    res.status(500).json({ error: 'Failed to create item' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid item id' });

    const ok = await MenuModel.updateItem(id, req.body);
    if (!ok) return res.status(404).json({ error: 'Item not found' });

    res.json({ success: true });
  } catch (e) {
    console.error('updateItem error:', e);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    console.log("➡️ deleteItem called with id:", req.params.id);  // 👈 בדיקה

    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid item id' });

    const ok = await MenuModel.deleteItem(id);
    if (!ok) return res.status(404).json({ error: 'Item not found' });

    res.json({ success: true });
  } catch (e) {
    console.error('deleteItem error:', e);
    res.status(500).json({ error: 'Failed to delete item' });
  }
};
