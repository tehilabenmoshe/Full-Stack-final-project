const pool = require('../db_connection');

module.exports = {
  async getCategories() {
    const [rows] = await pool.query(
      'SELECT id, name, image_url, sort_order FROM categories ORDER BY sort_order IS NULL, sort_order, name'
    );
    return rows;
  },

  async getItemsByCategory(categoryId) {
    const [rows] = await pool.query(
      `SELECT id, name, description, price, image_url, category_id
       FROM items
       WHERE category_id = ? AND (is_active = 1 OR is_active IS NULL)
       ORDER BY name`,
      [categoryId]
    );
    return rows;
  },

  async searchItems(q) {
    const like = `%${q}%`;
    const [rows] = await pool.query(
      `SELECT id, name, description, price, image_url, category_id
       FROM items
       WHERE (is_active = 1 OR is_active IS NULL)
         AND (name LIKE ? OR description LIKE ?)
       ORDER BY name`,
      [like, like]
    );
    return rows;
  }
};
