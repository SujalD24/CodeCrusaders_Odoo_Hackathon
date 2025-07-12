const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ msg: 'User not found' });

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({ msg: 'Account suspended. Please contact support.' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token invalid or expired' });
  }
};

module.exports = authMiddleware;
