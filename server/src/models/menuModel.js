const pool = require('../db_connection');

module.exports = {
  
  async getCategories() {
    const [rows] = await pool.query(
      'SELECT id, name, description, image_url FROM categories ORDER BY name'
    );
    return rows;
  },

  // get dishes by category
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
    // get all dishes (ללא סינון קטגוריה)
  async getAllItems() {
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
       FROM dishes`
    );
    return rows;
  },


// search dishes by name
  async searchItems(q) {
    const like = `%${q}%`;
    const [rows] = await pool.query(
  `SELECT id, name, description, price, image_url, category_id
     FROM dishes
     WHERE (available = 1 OR available IS NULL)
       AND name LIKE ?
     ORDER BY name`,
      [like, like]
    );
    return rows;
  },

  // --- ניהול קטגוריות (Admin) ---
  async createCategory({ name, description, image_url }) {
    const [result] = await pool.query(
      `INSERT INTO categories (name, description, image_url) VALUES (?,?,?)`,
      [name, description || null, image_url || null]
    );
    return result.insertId;
  },

  async updateCategory(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return false;

    const values = Object.values(fields);
    const setClause = keys.map(k => `${k} = ?`).join(', ');

    const [result] = await pool.query(
      `UPDATE categories SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return result.affectedRows > 0;
  },

  async deleteCategory(id) {
    const [result] = await pool.query(
      `DELETE FROM categories WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  },

  // --- ניהול מנות (Admin) ---
  async createItem({ name, description, price, category_id, image_url }) {
    const [result] = await pool.query(
      `INSERT INTO dishes (name, description, price, category_id, image_url)
       VALUES (?,?,?,?,?)`,
      [name, description || null, price, category_id, image_url || null]
    );
    return result.insertId;
  },

  async updateItem(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return false;

    const values = Object.values(fields);
    const setClause = keys.map(k => `${k} = ?`).join(', ');

    const [result] = await pool.query(
      `UPDATE dishes SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return result.affectedRows > 0;
  },

  async deleteItem(id) {
    const [result] = await pool.query(
      `DELETE FROM dishes WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
};
