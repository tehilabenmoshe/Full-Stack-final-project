// server/src/routes/users.routes.js
const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/usersController');

// אם כבר הוספת Joi ומידלוור validate, אפשר להפעיל כך:
// const validate = require('../middleware/validate');
// const { registerSchema, loginSchema, updateSchema } = require('../validators/userValidator');

// --- Public ---
router.post('/register', usersCtrl.register);          // או: validate(registerSchema), usersCtrl.register
router.post('/login', usersCtrl.login);                // או: validate(loginSchema), usersCtrl.login

// --- Protected (דורש JWT) ---
router.get('/me', usersCtrl.requireAuth, usersCtrl.me);
router.get('/', usersCtrl.requireAuth, usersCtrl.list);
router.get('/:id', usersCtrl.requireAuth, usersCtrl.getById);
// אם יש Joi לעדכון: validate(updateSchema)
router.put('/:id', usersCtrl.requireAuth, usersCtrl.update);
router.delete('/:id', usersCtrl.requireAuth, usersCtrl.remove);

module.exports = router;
