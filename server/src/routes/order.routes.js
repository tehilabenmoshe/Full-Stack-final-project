const express = require('express');
const router = express.Router();
const ordersCtrl = require('../controllers/orderController');
const usersCtrl = require('../controllers/usersController'); // כדי להגן עם requireAuth

// כל ההזמנות של משתמש
router.get('/user/:id', usersCtrl.requireAuth, ordersCtrl.getOrdersByUser);

module.exports = router;
