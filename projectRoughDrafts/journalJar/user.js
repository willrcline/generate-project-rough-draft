// Require necessary modules
const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  timezone: { type: String, required: true },
  journalEntries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Journal' }],
  promptTime: { type: String, required: true },
});

// Define user model
const User = mongoose.model('User', userSchema);

// Export user model
module.exports = User;