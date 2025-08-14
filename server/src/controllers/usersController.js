// controllers/usersController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const UserModel = require('../models/UserModel'); // ודאי שהנתיב נכון

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function safeUser(u) {
  if (!u) return null;
  const { password_hash, ...rest } = u;
  return rest;
}

/** POST /api/users/register */
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, password are required' });
    }

    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userId = await UserModel.create({ name, email, password_hash, phone });
    const user = await UserModel.findById(userId);

    const token = signToken({ id: user.id, email: user.email });
    return res.status(201).json({ user: safeUser(user), token });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ error: 'Failed to register' });
  }
};

/** POST /api/users/login */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ id: user.id, email: user.email });
    return res.json({ user: safeUser(user), token });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ error: 'Failed to login' });
  }
};

/** Middleware: Require JWT */
exports.requireAuth = (req, res, next) => {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing Authorization header' });
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, email, iat, exp }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/** GET /api/users/me */
exports.me = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) return res.status(401).json({ error: 'Unauthorized' });
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user: safeUser(user) });
  } catch (err) {
    console.error('me error:', err);
    return res.status(500).json({ error: 'Failed to load profile' });
  }
};

/** GET /api/users */
exports.list = async (_req, res) => {
  try {
    const rows = await UserModel.findAll();
    return res.json(rows);
  } catch (err) {
    console.error('list error:', err);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

/** GET /api/users/:id */
exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(safeUser(user));
  } catch (err) {
    console.error('getById error:', err);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
};

/** PUT /api/users/:id */
exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });

    const { name, phone, password } = req.body || {};
    const fields = {};
    if (name !== undefined) fields.name = name;
    if (phone !== undefined) fields.phone = phone;
    if (password !== undefined && password !== '') {
      fields.password_hash = await bcrypt.hash(password, 10);
    }
    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const ok = await UserModel.update(id, fields);
    if (!ok) return res.status(404).json({ error: 'User not found' });

    const user = await UserModel.findById(id);
    return res.json(safeUser(user));
  } catch (err) {
    console.error('update error:', err);
    return res.status(500).json({ error: 'Failed to update user' });
  }
};

/** DELETE /api/users/:id */
exports.remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid id' });
    const ok = await UserModel.remove(id);
    if (!ok) return res.status(404).json({ error: 'User not found' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('remove error:', err);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};
