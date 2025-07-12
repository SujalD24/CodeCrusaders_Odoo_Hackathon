const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['swap_request', 'swap_accepted', 'swap_rejected', 'swap_completed', 'rating_received', 'admin_message'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedSwap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Swap'
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isRead: { type: Boolean, default: false },
  emailSent: { type: Boolean, default: false }
}, { timestamps: true });

// Index for efficient querying
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);