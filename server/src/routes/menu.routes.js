const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/menuController');
const usersCtrl = require('../controllers/usersController'); // בשביל requireAuth

router.get('/categories', usersCtrl.requireAuth, ctrl.getCategories);
router.get('/items', usersCtrl.requireAuth, ctrl.getItems);           // ?categoryId=#
router.get('/search', usersCtrl.requireAuth, ctrl.search);            // ?q=...

module.exports = router;
