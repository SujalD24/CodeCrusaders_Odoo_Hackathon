const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: String,
  profilePhoto: String,
  skillsOffered: [String],
  skillsWanted: [String],
  availability: String,
  isPublic: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  completedSwaps: { type: Number, default: 0 }
}, { timestamps: true });

// Index for search functionality
userSchema.index({ skillsOffered: 'text', location: 'text', name: 'text' });

module.exports = mongoose.model('User', userSchema);
