const pool = require('../db_connection');

module.exports = {
  async getCategories() {
    const [rows] = await pool.query(
      'SELECT id, name, description, image_url FROM categories ORDER BY name'
    );
    return rows;
  },

  async getItems(categoryId) {
  const [rows] = await pool.query(
    `SELECT 
       id,
       category_id,
       name,
       description,
       price,
       image_url,
       available,
       created_at
     FROM dishes
     WHERE category_id = ?`,
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
