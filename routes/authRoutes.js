const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateRegistration, validateLogin } = require('../middlewares/validation');

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
