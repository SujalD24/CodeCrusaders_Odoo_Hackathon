const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { validateProfileUpdate } = require('../middlewares/validation');
const User = require('../models/user');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, validateProfileUpdate, async (req, res) => {
  try {
    const { name, location, profilePhoto, skillsOffered, skillsWanted, availability, isPublic } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, location, profilePhoto, skillsOffered, skillsWanted, availability, isPublic },
      { new: true, select: '-password' }
    );
    
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Search users
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { skill, location, availability } = req.query;
    let query = { isPublic: true, _id: { $ne: req.user._id }, isBanned: false };
    
    if (skill) {
      query.skillsOffered = { $regex: skill, $options: 'i' };
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (availability) {
      query.availability = { $regex: availability, $options: 'i' };
    }
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get user by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Don't show banned users to regular users
    if (user.isBanned && !req.user.isAdmin) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Only return public profiles or the user's own profile
    if (!user.isPublic && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Profile is private' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;