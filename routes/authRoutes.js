const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { register, login } = require('../controllers/authController');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get current user
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
