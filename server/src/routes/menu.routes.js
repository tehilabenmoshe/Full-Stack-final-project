// const express = require('express');
// const router = express.Router();
// const ctrl = require('../controllers/menuController');
// const usersCtrl = require('../controllers/usersController'); // בשביל requireAuth
// const isAdmin = require('../middleware/isAdmin');

// router.get('/categories', usersCtrl.requireAuth, ctrl.getCategories);
// router.get('/items', usersCtrl.requireAuth, ctrl.getItems);           // ?categoryId=#
// router.get('/search', usersCtrl.requireAuth, ctrl.search);            // ?q=...


// module.exports = router;
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/menuController');
const usersCtrl = require('../controllers/usersController'); // בשביל requireAuth
const isAdmin = require('../middleware/isAdmin');

// --- פתוח לכל משתמש מחובר ---
router.get('/categories', usersCtrl.requireAuth, ctrl.getCategories);
router.get('/items', usersCtrl.requireAuth, ctrl.getItems);     // ?categoryId=#
router.get('/search', usersCtrl.requireAuth, ctrl.search);      // ?q=...

// --- פעולות ניהול (Admin בלבד) ---
// קטגוריות
router.post('/categories', usersCtrl.requireAuth, isAdmin, ctrl.createCategory);
router.put('/categories/:id', usersCtrl.requireAuth, isAdmin, ctrl.updateCategory);
router.delete('/categories/:id', usersCtrl.requireAuth, isAdmin, ctrl.deleteCategory);

// פריטים
router.post('/items', usersCtrl.requireAuth, isAdmin, ctrl.createItem);
router.put('/items/:id', usersCtrl.requireAuth, isAdmin, ctrl.updateItem);
router.delete('/items/:id', usersCtrl.requireAuth, isAdmin, ctrl.deleteItem);

module.exports = router;
