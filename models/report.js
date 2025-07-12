const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['activity', 'feedback', 'swaps', 'users', 'ratings'],
    required: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateRange: {
    from: Date,
    to: Date
  },
  data: mongoose.Schema.Types.Mixed, // Flexible data structure for different report types
  summary: {
    totalUsers: Number,
    totalSwaps: Number,
    totalRatings: Number,
    averageRating: Number,
    activeUsers: Number,
    completedSwaps: Number
  },
  fileName: String,
  fileSize: Number,
  isDownloaded: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);