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
  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
