const pool = require('../db_connection');
const bcrypt = require('bcryptjs');

/** ✅ דואגים שהעמודה note קיימת ב-order_items */
async function ensureSchema() {
  const [[exists]] = await pool.query(
    `SELECT 1 AS ok
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'order_items'
       AND COLUMN_NAME = 'note'
     LIMIT 1`
  );
  if (!exists) {
    console.log('🛠  Adding column order_items.note ...');
    await pool.query(`ALTER TABLE order_items ADD COLUMN note TEXT NULL`);
    console.log('✅  Column order_items.note added');
  }
}

// clean tables func
async function clearData() {
  console.log('🗑 Clearing tables...');

  await pool.query('DELETE FROM order_items');
  await pool.query('ALTER TABLE order_items AUTO_INCREMENT = 1');

  await pool.query('DELETE FROM orders');
  await pool.query('ALTER TABLE orders AUTO_INCREMENT = 1');

  await pool.query('DELETE FROM dishes');
  await pool.query('ALTER TABLE dishes AUTO_INCREMENT = 1');

  await pool.query('DELETE FROM categories');
  await pool.query('ALTER TABLE categories AUTO_INCREMENT = 1');

  await pool.query('DELETE FROM users');
  await pool.query('ALTER TABLE users AUTO_INCREMENT = 1');

  console.log('tables cleared and AUTO_INCREMENT reset');
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
      const password_hash = await bcrypt.hash('Password123', 10);
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
    { name: 'Mains',   description: 'Hot and fresh main dishes',  image_url: '/photos/categoriesPhotos/mains.png' },
    { name: 'Snacks',  description: 'Small bites and appetizers', image_url: '/photos/categoriesPhotos/snacks.png' },
    { name: 'Desserts',description: 'Cakes, sweets and pastries', image_url: '/photos/categoriesPhotos/desserts.png' },
    { name: 'Salads',  description: 'Fresh and healthy salads',   image_url: '/photos/categoriesPhotos/salads.png' },
    { name: 'Drinks',  description: 'Refreshing cold drinks',     image_url: '/photos/categoriesPhotos/drinks.png' }
  ];

  for (const c of categories) {
    await pool.query(
      `INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)`,
      [c.name, c.description, c.image_url]
    );
  }
  console.log('Categories with images added');
}

// add dishes data func
async function seedDishes() {
  const [categories] = await pool.query(`SELECT id, name FROM categories`);
  const categoryMap = {};
  for (const c of categories) categoryMap[c.name] = c.id;

  const dishes = [
    // Mains
    { name: 'Shawarma in Pita', description: 'Fresh shawarma with tahini and salad', price: 38, category: 'Mains',   image_url: '/photos/dishesPhotos/mains/shawarma.jpg' },
    { name: 'Grilled Chicken Breast', description: 'Juicy grilled chicken breast',  price: 42, category: 'Mains',   image_url: '/photos/dishesPhotos/mains/chicken.jpg' },
    { name: 'Pasta with Tomato Sauce', description: 'Italian pasta with rich tomato sauce', price: 36, category: 'Mains', image_url: '/photos/dishesPhotos/mains/pasta.jpg' },
    { name: 'Family Pizza', description: 'Large pizza with cheese and olives',      price: 55, category: 'Mains',   image_url: '/photos/dishesPhotos/mains/pizza.jpg' },

    // Snacks
    { name: 'Classic Fries', description: 'Crispy fries with sea salt',             price: 18, category: 'Snacks',  image_url: '/photos/dishesPhotos/snacks/fries.jpg' },
    { name: 'Onion Rings',   description: 'Crispy battered onion rings',            price: 20, category: 'Snacks',  image_url: '/photos/dishesPhotos/snacks/onion_rings.jpg' },
    { name: 'Garlic Bread',  description: 'Baked bread with garlic butter',         price: 22, category: 'Snacks',  image_url: '/photos/dishesPhotos/snacks/garlic_bread.jpg' },
    { name: 'Nachos with Salsa', description: 'Spicy nachos with salsa dip',        price: 25, category: 'Snacks',  image_url: '/photos/dishesPhotos/snacks/nachos.jpg' },

    // Desserts
    { name: 'Chocolate Souffle', description: 'Warm chocolate cake with ice cream', price: 28, category: 'Desserts', image_url: '/photos/dishesPhotos/desserts/souffle.jpg' },
    { name: 'Cheesecake',        description: 'Cold cheesecake with biscuit base',  price: 30, category: 'Desserts', image_url: '/photos/dishesPhotos/desserts/cheesecake.jpg' },
    { name: 'Vanilla Ice Cream', description: 'Classic scoop of vanilla ice cream', price: 18, category: 'Desserts', image_url: '/photos/dishesPhotos/desserts/icecream.jpg' },
    { name: 'Knafeh',            description: 'Middle Eastern dessert with sweet cheese', price: 32, category: 'Desserts', image_url: '/photos/dishesPhotos/desserts/knafeh.jpg' },

    // Drinks
    { name: 'Cola',            description: '330ml cola bottle',                    price: 12, category: 'Drinks',  image_url: '/photos/dishesPhotos/drinks/cola.jpg' },
    { name: 'Mineral Water',   description: '500ml mineral water bottle',           price: 8,  category: 'Drinks',  image_url: '/photos/dishesPhotos/drinks/water.jpg' },
    { name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice',     price: 15, category: 'Drinks',  image_url: '/photos/dishesPhotos/drinks/orange_juice.jpg' },
    { name: 'Lemonade',        description: 'Cold refreshing lemonade',             price: 14, category: 'Drinks',  image_url: '/photos/dishesPhotos/drinks/lemonade.jpg' },

    // Salads
    { name: 'Greek Salad',  description: 'Salad with feta, olives and vegetables',  price: 32, category: 'Salads',  image_url: '/photos/dishesPhotos/salads/greek_salad.jpg' },
    { name: 'Caesar Salad', description: 'Lettuce, croutons and parmesan with Caesar dressing', price: 35, category: 'Salads', image_url: '/photos/dishesPhotos/salads/caesar.jpg' },
    { name: 'Quinoa Salad', description: 'Quinoa with fresh vegetables and herbs',  price: 34, category: 'Salads',  image_url: '/photos/dishesPhotos/salads/quinoa.jpg' },
    { name: 'Chopped Vegetable Salad', description: 'Finely chopped cucumber, tomato, pepper and onion', price: 28, category: 'Salads', image_url: '/photos/dishesPhotos/salads/veggie_salad.jpg' }
  ];

  for (const d of dishes) {
    await pool.query(
      `INSERT INTO dishes (category_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)`,
      [categoryMap[d.category], d.name, d.description, d.price, d.image_url]
    );
  }

  console.log('Dishes with dummy images added');
}

// add orders data func (עם הערות per item)
async function seedOrders() {
  try {
    // === הזמנה ראשונה ===
    const [orderResult1] = await pool.query(
      `INSERT INTO orders (user_id, status, total_price) VALUES (?, ?, ?)`,
      [1, 'pending', 122.00] // 2×Pizza + 1×Cola
    );
    const orderId1 = orderResult1.insertId;

    // ⬇️ שמים note לכל שורה
    await pool.query(
      `INSERT INTO order_items (order_id, dish_id, quantity, price, note)
       VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)`,
      [
        orderId1, 4, 2, 55.00, 'Extra olives, no mushrooms',
        orderId1, 13, 1, 12.00, 'Cold please'
      ]
    );

    console.log(`order #${orderId1} added`);

    // === הזמנה שנייה ===
    const [orderResult2] = await pool.query(
      `INSERT INTO orders (user_id, status, total_price) VALUES (?, ?, ?)`,
      [1, 'completed', 80.00] // לדוגמה 2×Pasta
    );
    const orderId2 = orderResult2.insertId;

    await pool.query(
      `INSERT INTO order_items (order_id, dish_id, quantity, price, note)
       VALUES (?, ?, ?, ?, ?)`,
      [
        orderId2, 3, 2, 40.00, 'Gluten-free pasta if possible'
      ]
    );

    console.log(`order #${orderId2} added`);

  } catch (err) {
    console.error('Error adding orders', err);
  }
}

// main add data func
async function seed() {
  try {
    await ensureSchema();     // ✅ לפני הכל: לוודא שיש עמודת note
    await clearData();
    await seedUsers();
    await seedCategories();
    await seedDishes();
    await seedOrders();
    console.log('Seeding finished successfully');
  } catch (err) {
    console.error('Error - in main seeding function:', err);
  } finally {
    await pool.end();
  }
}

seed();
