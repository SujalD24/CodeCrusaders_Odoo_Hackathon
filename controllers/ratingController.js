const Rating = require('../models/rating');
const Swap = require('../models/swap');
const User = require('../models/user');
const Notification = require('../models/notification');

// Create a rating after swap completion
exports.createRating = async (req, res) => {
  try {
    const { swapId, rating, comment } = req.body;
    
    // Validate rating value
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }
    
    // Check if swap exists and is completed
    const swap = await Swap.findById(swapId);
    if (!swap) {
      return res.status(404).json({ msg: 'Swap not found' });
    }
    
    if (swap.status !== 'completed') {
      return res.status(400).json({ msg: 'Can only rate completed swaps' });
    }
    
    // Check if user was part of the swap
    if (swap.requester.toString() !== req.user._id.toString() && 
        swap.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'You were not part of this swap' });
    }
    
    // Determine who is being rated
    const ratedUserId = swap.requester.toString() === req.user._id.toString() ? swap.provider : swap.requester;
    
    // Check if rating already exists
    const existingRating = await Rating.findOne({ swap: swapId, rater: req.user._id });
    if (existingRating) {
      return res.status(400).json({ msg: 'You have already rated this swap' });
    }
    
    // Create the rating
    const newRating = new Rating({
      swap: swapId,
      rater: req.user._id,
      rated: ratedUserId,
      rating,
      comment,
      skillExchanged: swap.skillOffered
    });
    
    await newRating.save();
    
    // Update user's average rating
    await updateUserRating(ratedUserId);
    
    // Create notification for rated user
    const notification = new Notification({
      recipient: ratedUserId,
      type: 'rating_received',
      title: 'New Rating Received',
      message: `${req.user.name} rated you ${rating} stars for ${swap.skillOffered}`,
      relatedSwap: swapId,
      relatedUser: req.user._id
    });
    await notification.save();
    
    await newRating.populate(['rater', 'rated'], 'name email');
    res.status(201).json(newRating);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get ratings for a user
exports.getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const ratings = await Rating.find({ rated: userId })
      .populate('rater', 'name email')
      .populate('swap', 'skillOffered skillWanted')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Rating.countDocuments({ rated: userId });
    
    res.json({
      ratings,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get ratings given by a user
exports.getRatingsGiven = async (req, res) => {
  try {
    const ratings = await Rating.find({ rater: req.user._id })
      .populate('rated', 'name email')
      .populate('swap', 'skillOffered skillWanted')
      .sort({ createdAt: -1 });
    
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get rating for a specific swap
exports.getSwapRating = async (req, res) => {
  try {
    const { swapId } = req.params;
    
    const rating = await Rating.findOne({ 
      swap: swapId, 
      rater: req.user._id 
    }).populate(['rater', 'rated'], 'name email');
    
    if (!rating) {
      return res.status(404).json({ msg: 'Rating not found' });
    }
    
    res.json(rating);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update a rating (within 24 hours)
exports.updateRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { rating, comment } = req.body;
    
    const existingRating = await Rating.findById(ratingId);
    if (!existingRating) {
      return res.status(404).json({ msg: 'Rating not found' });
    }
    
    // Check if user owns this rating
    if (existingRating.rater.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'You can only update your own ratings' });
    }
    
    // Check if rating is within 24 hours
    const hoursSinceRating = (Date.now() - existingRating.createdAt) / (1000 * 60 * 60);
    if (hoursSinceRating > 24) {
      return res.status(400).json({ msg: 'Ratings can only be updated within 24 hours' });
    }
    
    // Validate new rating value
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' });
    }
    
    existingRating.rating = rating;
    if (comment !== undefined) existingRating.comment = comment;
    await existingRating.save();
    
    // Recalculate user's average rating
    await updateUserRating(existingRating.rated);
    
    await existingRating.populate(['rater', 'rated'], 'name email');
    res.json(existingRating);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Helper function to update user's average rating
async function updateUserRating(userId) {
  const ratings = await Rating.find({ rated: userId });
  
  if (ratings.length === 0) {
    await User.findByIdAndUpdate(userId, { 
      averageRating: 0, 
      totalRatings: 0 
    });
    return;
  }
  
  const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
  const averageRating = totalRating / ratings.length;
  
  await User.findByIdAndUpdate(userId, { 
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    totalRatings: ratings.length 
  });
}