// Import necessary modules
const mongoose = require('mongoose');

// Define the schema for the journal document
const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
  prompt: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  }
});

// Create the model for the journal document
const Journal = mongoose.model('Journal', journalSchema);

// Export the model
module.exports = Journal;