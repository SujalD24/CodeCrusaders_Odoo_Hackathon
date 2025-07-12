const mongoose = require('mongoose');

const adminMessageSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['announcement', 'maintenance', 'policy_update', 'feature_update'],
    default: 'announcement'
  },
  isActive: { type: Boolean, default: true },
  targetUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }], // Empty array means all users
  expiresAt: Date
}, { timestamps: true });

module.exports = mongoose.model('AdminMessage', adminMessageSchema);