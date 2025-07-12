const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  swap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Swap',
    required: true
  },
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String,
  skillExchanged: String
}, { timestamps: true });

// Ensure one rating per user per swap
ratingSchema.index({ swap: 1, rater: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);