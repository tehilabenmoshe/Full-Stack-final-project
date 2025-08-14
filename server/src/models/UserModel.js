// models/userModel.js
const pool = require('../db_connection');

const UserModel = {
  // יצירת משתמש חדש
  async create({ name, email, password_hash, phone }) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, phone) VALUES (?,?,?,?)',
      [name, email, password_hash, phone || null]
    );
    return result.insertId;
  },

  // מציאת משתמש לפי אימייל
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  // מציאת משתמש לפי ID
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // החזרת כל המשתמשים
  async findAll() {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, created_at FROM users ORDER BY id DESC'
    );
    return rows;
  },

  // עדכון משתמש
  async update(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return false;

    const values = Object.values(fields);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const [result] = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return result.affectedRows > 0;
  },

  // מחיקת משתמש
  async remove(id) {
    const [result] = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = UserModel;
