const pool = require('../db_connection');
const bcrypt = require('bcryptjs');

// clean tables func
async function clearData() {
  await pool.query('DELETE FROM dishes');
  await pool.query('ALTER TABLE dishes AUTO_INCREMENT = 1');

  await pool.query('DELETE FROM categories');
  await pool.query('ALTER TABLE categories AUTO_INCREMENT = 1');

  await pool.query('DELETE FROM users');
  await pool.query('ALTER TABLE users AUTO_INCREMENT = 1');
}

// add users data func
async function seedUsers() {
  try {
    const sampleUsers = [
      { name: 'Tehila Michaeli', email: 't.micha@example.com', phone: '052-1234567' },
      { name: 'Miryam Amar', email: 'm.amar@example.com', phone: '052-1234567' },
      { name: 'John Smith', email: 'john.smith@example.com', phone: '052-1234567' },
      { name: 'Emily Johnson', email: 'emily.johnson@example.com', phone: '050-7654321' },
      { name: 'Michael Brown', email: 'michael.brown@example.com', phone: '054-9876543' },
      { name: 'Sarah Davis', email: 'sarah.davis@example.com', phone: '058-2223344' },
      { name: 'David Miller', email: 'david.miller@example.com', phone: '053-8765432' },
      { name: 'Jessica Wilson', email: 'jessica.wilson@example.com', phone: '052-3344556' },
      { name: 'Daniel Anderson', email: 'daniel.anderson@example.com', phone: '050-1122334' },
      { name: 'Sophia Martinez', email: 'sophia.martinez@example.com', phone: '054-6677889' },
      { name: 'James Taylor', email: 'james.taylor@example.com', phone: '053-4455667' },
      { name: 'Olivia Thomas', email: 'olivia.thomas@example.com', phone: '052-9988776' },
      { name: 'William Lee', email: 'william.lee@example.com', phone: '050-5566778' },
      { name: 'Ava Harris', email: 'ava.harris@example.com', phone: '054-7788991' },
      { name: 'Benjamin Clark', email: 'benjamin.clark@example.com', phone: '058-3344557' },
      { name: 'Mia Lewis', email: 'mia.lewis@example.com', phone: '053-2233445' },
      { name: 'Ethan Walker', email: 'ethan.walker@example.com', phone: '052-6677885' },
      { name: 'Amelia Hall', email: 'amelia.hall@example.com', phone: '050-8899776' },
      { name: 'Alexander Allen', email: 'alexander.allen@example.com', phone: '054-4455669' },
      { name: 'Charlotte Young', email: 'charlotte.young@example.com', phone: '053-5566772' },
      { name: 'Henry King', email: 'henry.king@example.com', phone: '052-3344552' },
      { name: 'Ella Scott', email: 'ella.scott@example.com', phone: '050-6677883' }
    ];

    for (const user of sampleUsers) {
      const password_hash = await bcrypt.hash('Password123', 10); // same password for all
      await pool.query(
        `INSERT INTO users (name, email, password_hash, phone, role, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [user.name, user.email, password_hash, user.phone, 'user']
      );
    }

    console.log('Users added');
  } catch (err) {
    console.error('Error - adding users', err);
  }
}

// add categories data func
async function seedCategories() {
  const categories = [
    { name: 'Mains', description: 'Hot and fresh main dishes' },
    { name: 'Snacks', description: 'Small bites and appetizers' },
    { name: 'Desserts', description: 'Cakes, sweets and pastries' },
    { name: 'Salads', description: 'Fresh and healthy salads' },
    { name: 'Drinks', description: 'Refreshing cold drinks' }
  ];

  for (const c of categories) {
    await pool.query(
      `INSERT INTO categories (name, description) VALUES (?, ?)`,
      [c.name, c.description]
    );
  }
  console.log('Categories added');
}

// add dishes data func
async function seedDishes() {
  const [categories] = await pool.query(`SELECT id, name FROM categories`);
  const categoryMap = {};
  for (const c of categories) {
    categoryMap[c.name] = c.id;
  }

  const dishes = [
    // Mains
    { name: 'Shawarma in Pita', description: 'Fresh shawarma with tahini and salad', price: 38, category: 'Mains' },
    { name: 'Grilled Chicken Breast', description: 'Juicy grilled chicken breast', price: 42, category: 'Mains' },
    { name: 'Pasta with Tomato Sauce', description: 'Italian pasta with rich tomato sauce', price: 36, category: 'Mains' },
    { name: 'Family Pizza', description: 'Large pizza with cheese and olives', price: 55, category: 'Mains' },

    // Snacks
    { name: 'Classic Fries', description: 'Crispy fries with sea salt', price: 18, category: 'Snacks' },
    { name: 'Onion Rings', description: 'Crispy battered onion rings', price: 20, category: 'Snacks' },
    { name: 'Garlic Bread', description: 'Baked bread with garlic butter', price: 22, category: 'Snacks' },
    { name: 'Nachos with Salsa', description: 'Spicy nachos with salsa dip', price: 25, category: 'Snacks' },

    // Desserts
    { name: 'Chocolate Souffle', description: 'Warm chocolate cake with ice cream', price: 28, category: 'Desserts' },
    { name: 'Cheesecake', description: 'Cold cheesecake with biscuit base', price: 30, category: 'Desserts' },
    { name: 'Vanilla Ice Cream', description: 'Classic scoop of vanilla ice cream', price: 18, category: 'Desserts' },
    { name: 'Knafeh', description: 'Middle Eastern dessert with sweet cheese', price: 32, category: 'Desserts' },

    // Drinks
    { name: 'Cola', description: '330ml cola bottle', price: 12, category: 'Drinks' },
    { name: 'Mineral Water', description: '500ml mineral water bottle', price: 8, category: 'Drinks' },
    { name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice', price: 15, category: 'Drinks' },
    { name: 'Lemonade', description: 'Cold refreshing lemonade', price: 14, category: 'Drinks' },

    // Salads
    { name: 'Greek Salad', description: 'Salad with feta, olives and vegetables', price: 32, category: 'Salads' },
    { name: 'Caesar Salad', description: 'Lettuce, croutons and parmesan with Caesar dressing', price: 35, category: 'Salads' },
    { name: 'Quinoa Salad', description: 'Quinoa with fresh vegetables and herbs', price: 34, category: 'Salads' },
    { name: 'Chopped Vegetable Salad', description: 'Finely chopped cucumber, tomato, pepper and onion', price: 28, category: 'Salads' }
  ];

  for (const d of dishes) {
    await pool.query(
      `INSERT INTO dishes (category_id, name, description, price) VALUES (?, ?, ?, ?)`,
      [categoryMap[d.category], d.name, d.description, d.price]
    );
  }

  console.log('Dishes added');
}

// main add data func
async function seed() {
  try {
    await clearData();
    await seedUsers();
    await seedCategories();
    await seedDishes();
    console.log('Seeding finished successfully');
  } catch (err) {
    console.error('Error - in main seeding function:', err);
  } finally {
    await pool.end();
  }
}

seed();
