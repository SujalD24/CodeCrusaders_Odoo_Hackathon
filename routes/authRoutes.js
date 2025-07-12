const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
