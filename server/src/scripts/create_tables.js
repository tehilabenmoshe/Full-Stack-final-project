const pool = require('../db_connection');

//create users table
async function createUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(120) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      phone VARCHAR(30),
      role ENUM('customer','admin') DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);
  console.log(' Users table created');
}

//create categories table
async function createCategoriesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      image_url VARCHAR(255),             -- ✅ הוספנו עמודה לתמונה
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);
  console.log('Categories table created');
}



 //create dishes table
async function createDishesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dishes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(6,2) NOT NULL,
      image_url VARCHAR(255),
      available BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);
  console.log('Dishes table created');
}


// create orders table
async function createOrdersTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending','in_progress','completed','cancelled') DEFAULT 'pending',
        total_price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Orders table created');
  } catch (err) {
    console.error('Error creating Orders table:', err);
  }
}

//  create Order_Items table
async function createOrderItemsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        dish_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (dish_id) REFERENCES dishes(id) ON DELETE CASCADE
      )
    `);
    console.log('Order_Items table created');
  } catch (err) {
    console.error('Error creating Order_Items table:', err);
  }
}


//  main function to build tables
async function createTables() {
  try {

await pool.query('DROP TABLE IF EXISTS order_items');
    await pool.query('DROP TABLE IF EXISTS orders');
    await pool.query('DROP TABLE IF EXISTS dishes');
    await pool.query('DROP TABLE IF EXISTS categories');


    console.log('✅ All tables dropped');

    await createUsersTable();
    await createCategoriesTable();
    await createDishesTable();
    await createOrdersTable();
    await createOrderItemsTable();
    console.log(' All tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    await pool.end();
  }
}



createTables();
