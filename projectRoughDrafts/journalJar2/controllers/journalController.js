// Import necessary modules
const Journal = require('../models/journal');
const User = require('../models/user');
const twilioService = require('../services/twilioService');
const googleDocsService = require('../services/googleDocsService');

// Function to send daily journal prompts to users
async function sendJournalPrompts() {
  try {
    // Get all users from database
    const users = await User.find();

    // Loop through each user and send them a journal prompt
    for (let user of users) {
      // Get user's timezone and daily journal prompt time from user settings
      const timezone = user.settings.timezone;
      const journalPromptTime = user.settings.journalPromptTime;

      // Get current date and time in user's timezone
      const currentDate = new Date().toLocaleString('en-US', { timeZone: timezone });
      const currentTime = new Date(currentDate).getHours();

      // Check if it's time to send the journal prompt
      if (currentTime === journalPromptTime) {
        // Send the journal prompt via Twilio
        await twilioService.sendMessage(user.phoneNumber, user.settings.journalPrompt);

        // Create a new journal entry for the user
        const newJournalEntry = new Journal({
          userId: user._id,
          prompt: user.settings.journalPrompt,
          date: new Date().toLocaleDateString('en-US', { timeZone: timezone })
        });

        // Save the journal entry to the database
        await newJournalEntry.save();
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Function to process user's journal response
async function processJournalResponse(userId, response) {
  try {
    // Get user's timezone
    const user = await User.findById(userId);
    const timezone = user.settings.timezone;

    // Get today's journal entry for the user
    const today = new Date().toLocaleDateString('en-US', { timeZone: timezone });
    const journalEntry = await Journal.findOne({ userId: userId, date: today });

    // Append the user's response to the journal entry
    journalEntry.response = response;

    // Save the updated journal entry to the database
    await journalEntry.save();

    // Upload the journal entry to Google Docs
    await googleDocsService.uploadJournalEntry(journalEntry);
  } catch (err) {
    console.error(err);
  }
}

// Export functions for use in journalRoutes.js
module.exports = {
  sendJournalPrompts,
  processJournalResponse
};