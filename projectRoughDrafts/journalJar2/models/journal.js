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
    required: true
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

// Define a method to add a new journal entry to the database
journalSchema.statics.addEntry = async function(user, date, prompt, response) {
  try {
    const entry = new Journal({
      user: user,
      date: date,
      prompt: prompt,
      response: response
    });
    await entry.save();
    return entry;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Define a method to get all journal entries for a specific user
journalSchema.statics.getAllEntriesForUser = async function(user) {
  try {
    const entries = await Journal.find({ user: user }).sort({ date: -1 });
    return entries;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Export the journal model
const Journal = mongoose.model('Journal', journalSchema);
module.exports = Journal;