// Import necessary modules
const mongoose = require('mongoose');

// Define the schema for the journal document
const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  entry: {
    type: String,
    required: true
  }
});

// Define a method to get all journal entries for a specific user
journalSchema.statics.getEntriesForUser = async function(userId) {
  return await this.find({ user: userId }).sort({ date: -1 });
};

// Define a method to add a new journal entry for a specific user
journalSchema.statics.addEntryForUser = async function(userId, entry) {
  const newEntry = new this({ user: userId, entry });
  return await newEntry.save();
};

// Export the journal model
module.exports = mongoose.model('Journal', journalSchema);