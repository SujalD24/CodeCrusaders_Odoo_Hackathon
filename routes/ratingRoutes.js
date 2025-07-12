const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateRatingCreation } = require('../middlewares/validation');

// All routes require authentication
router.use(authMiddleware);

// Create a rating after swap completion
router.post('/', validateRatingCreation, ratingController.createRating);

// Get ratings given by current user
router.get('/given', ratingController.getRatingsGiven);

// Get ratings for a specific user
router.get('/user/:userId', ratingController.getUserRatings);

// Get rating for a specific swap
router.get('/swap/:swapId', ratingController.getSwapRating);

// Update a rating (within 24 hours)
router.put('/:ratingId', ratingController.updateRating);

module.exports = router;