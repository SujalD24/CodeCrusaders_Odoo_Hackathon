const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swapController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateSwapCreation } = require('../middlewares/validation');

// All routes require authentication
router.use(authMiddleware);

// Create a new swap request
router.post('/', validateSwapCreation, swapController.createSwap);

// Get user's swaps (sent and received)
router.get('/', swapController.getUserSwaps);

// Get specific swap details
router.get('/:id', swapController.getSwap);

// Accept a swap request
router.put('/:id/accept', swapController.acceptSwap);

// Reject a swap request
router.put('/:id/reject', swapController.rejectSwap);

// Complete a swap
router.put('/:id/complete', swapController.completeSwap);

// Cancel a swap request
router.delete('/:id', swapController.cancelSwap);

module.exports = router;