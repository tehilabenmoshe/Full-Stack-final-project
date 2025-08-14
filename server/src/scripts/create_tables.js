const pool = require('../db_connection');

async function createUsersTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(80) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(30),
        role ENUM('user','admin','courier') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Users table created (or already exists)");
  } catch (err) {
    console.error("❌ Error creating users table:", err);
  } finally {
    pool.end(); // סוגר את החיבור ל-DB
  }
}

createUsersTable();
