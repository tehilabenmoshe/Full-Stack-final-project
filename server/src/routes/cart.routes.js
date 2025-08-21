const router = require('express').Router();
const users = require('../controllers/usersController');
const cart  = require('../controllers/cartController');

router.post('/add',     users.requireAuth, cart.addToCart);
router.get('/',         users.requireAuth, cart.getCart);
router.patch('/item/:id', users.requireAuth, cart.updateItemQty);
router.delete('/item/:id', users.requireAuth, cart.removeItem);

module.exports = router;
