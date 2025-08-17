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
      { name: 'דנה כהן', email: 'dana.cohen@example.com', phone: '052-1234567' },
      { name: 'איתי לוי', email: 'itai.levi@example.com', phone: '050-7654321' },
      { name: 'נועה רוזן', email: 'noa.rozen@example.com', phone: '054-9876543' },
      { name: 'אדם ברק', email: 'adam.barak@example.com', phone: '058-2223344' },
      { name: 'לירון פרץ', email: 'liron.peretz@example.com', phone: '053-8765432' },
      { name: 'מיכל כהן', email: 'michal.cohen@example.com', phone: '052-3344556' },
      { name: 'רועי ישראלי', email: 'roi.israeli@example.com', phone: '050-1122334' },
      { name: 'סיון כהן', email: 'sivan.cohen@example.com', phone: '054-6677889' },
      { name: 'דוד לוי', email: 'david.levi@example.com', phone: '053-4455667' },
      { name: 'עדי בר', email: 'adi.bar@example.com', phone: '052-9988776' },
      { name: 'שיר כהן', email: 'shir.cohen@example.com', phone: '050-5566778' },
      { name: 'טל רוזן', email: 'tal.rozen@example.com', phone: '054-7788991' },
      { name: 'יואב פרץ', email: 'yoav.peretz@example.com', phone: '058-3344557' },
      { name: 'מאיה לוי', email: 'maya.levi@example.com', phone: '053-2233445' },
      { name: 'עמית ישראלי', email: 'amit.israeli@example.com', phone: '052-6677885' },
      { name: 'אלון ברק', email: 'alon.barak@example.com', phone: '050-8899776' },
      { name: 'קרן כהן', email: 'keren.cohen@example.com', phone: '054-4455669' },
      { name: 'גיא לוי', email: 'guy.levi@example.com', phone: '053-5566772' },
      { name: 'הדר ישראלי', email: 'hadar.israeli@example.com', phone: '052-3344552' },
      { name: 'ליאור בר', email: 'lior.bar@example.com', phone: '050-6677883' }
    ];

    for (const user of sampleUsers) {
      const password_hash = await bcrypt.hash('Password123', 10); // סיסמה אחידה לכולם
      await pool.query(
        `INSERT INTO users (name, email, password_hash, phone, role, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [user.name, user.email, password_hash, user.phone, 'user']
      );
    }

    console.log('Users added ');
  } catch (err) {
    console.error(' Error adding users', err);
  }
}

//add categories data func
async function seedCategories() {
  const categories = [
    { name: 'עיקריות', description: 'מנות עיקריות חמות וטריות' },
    { name: 'נשנושים', description: 'חטיפים ומנות קטנות' },
    { name: 'מתוקים', description: 'קינוחים, עוגות ומאפים' },
    { name: 'סלטים', description: 'סלטים מירקות טריים' },
    { name: 'שתיה קרה', description: 'משקאות מרעננים' }

  ];

  for (const c of categories) {
    await pool.query(
      `INSERT INTO categories (name, description) VALUES (?, ?)`,
      [c.name, c.description]
    );
  }
  console.log(' Categories added');
}


//add dishes data func
async function seedDishes() {
  // pull categories id from DB
  const [categories] = await pool.query(`SELECT id, name FROM categories`);
  const categoryMap = {};
  for (const c of categories) {
    categoryMap[c.name] = c.id;
  }

  const dishes = [
    // עיקריות
    { name: 'שווארמה בפיתה', description: 'שווארמה טרייה עם טחינה וסלטים', price: 38, category: 'עיקריות' },
    { name: 'חזה עוף בגריל', description: 'חזה עוף עסיסי על האש', price: 42, category: 'עיקריות' },
    { name: 'פסטה ברוטב עגבניות', description: 'פסטה איטלקית עם רוטב עגבניות עשיר', price: 36, category: 'עיקריות' },
    { name: 'פיצה משפחתית', description: 'פיצה בגודל משפחתי עם גבינה וזיתים', price: 55, category: 'עיקריות' },

    // נשנושים
    { name: 'צ’יפס קלאסי', description: 'צ’יפס פריך עם מלח גס', price: 18, category: 'נשנושים' },
    { name: 'טבעות בצל', description: 'טבעות בצל מצופות פריכות', price: 20, category: 'נשנושים' },
    { name: 'לחמניות שום', description: 'לחמניות אפויות בחמאת שום', price: 22, category: 'נשנושים' },
    { name: 'נאצ’וס עם סלסה', description: 'נאצ’וס חריף עם רוטב סלסה', price: 25, category: 'נשנושים' },

    // מתוקים
    { name: 'סופלה שוקולד', description: 'עוגת שוקולד חמה עם גלידה', price: 28, category: 'מתוקים' },
    { name: 'עוגת גבינה קרה', description: 'עוגה קרה עם ביסקוויטים וגבינה', price: 30, category: 'מתוקים' },
    { name: 'גלידת וניל', description: 'כדור גלידת וניל קלאסית', price: 18, category: 'מתוקים' },
    { name: 'כנאפה', description: 'קינוח מזרחי עם גבינה מתוקה', price: 32, category: 'מתוקים' },

    // שתיה קרה
    { name: 'קולה', description: 'בקבוק אישי 330 מ"ל', price: 12, category: 'שתיה קרה' },
    { name: 'מים מינרליים', description: 'בקבוק אישי 500 מ"ל', price: 8, category: 'שתיה קרה' },
    { name: 'מיץ תפוזים טבעי', description: 'כוס מיץ סחוט טרי', price: 15, category: 'שתיה קרה' },
    { name: 'לימונדה ', description: 'כוס לימונדה צוננת', price: 14, category: 'שתיה קרה' },

    // סלטים
    { name: 'סלט יווני', description: 'סלט עם פטה, זיתים וירקות', price: 32, category: 'סלטים' },
    { name: 'סלט קיסר', description: 'חסה, קרוטונים ופרמזן עם רוטב קיסר', price: 35, category: 'סלטים' },
    { name: 'סלט קינואה וירקות', description: 'קינואה, עגבניות, מלפפונים ועשבי תיבול', price: 34, category: 'סלטים' },
    { name: 'סלט ישראלי קצוץ', description: 'מלפפון, עגבניה, פלפל ובצל קצוצים דק', price: 28, category: 'סלטים' }
  ];

  for (const d of dishes) {
    await pool.query(
      `INSERT INTO dishes (category_id, name, description, price) VALUES (?, ?, ?, ?)`,
      [categoryMap[d.category], d.name, d.description, d.price]
    );
  }

  console.log(' Dishes added');
}


// main add data func
async function seed() {
  try {
    await clearData();
    await seedUsers();
    await seedCategories();
    await seedDishes();
    console.log(' main func finished');
  } catch (err) {
    console.error('Error in main func :', err);
  } finally {
    await pool.end();
  }
}

seed();
