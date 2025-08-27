
module.exports = function isAdmin(req, res, next) {
  try {
    if (req.user && req.user.role === 'admin') {
      // יש הרשאה - המשתמש הוא אדמין
      return next();
    } else {
      // המשתמש לא אדמין
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
  } catch (err) {
    console.error('isAdmin middleware error:', err);
    return res.status(500).json({ error: 'Server error in isAdmin middleware' });
  }
};
