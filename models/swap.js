const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillOffered: { type: String, required: true },
  skillWanted: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  proposedTime: String,
  duration: String,
  location: String,
  notes: String,
  responseDate: Date,
  completionDate: Date
}, { timestamps: true });

// Index for efficient querying
swapSchema.index({ requester: 1, status: 1 });
swapSchema.index({ provider: 1, status: 1 });

module.exports = mongoose.model('Swap', swapSchema);