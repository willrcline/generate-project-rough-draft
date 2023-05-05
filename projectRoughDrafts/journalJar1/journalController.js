// Import necessary modules and services
const Journal = require('../models/journal');
const User = require('../models/user');
const twilioService = require('../services/twilioService');
const googleDocsService = require('../services/googleDocsService');

// Function to send journal prompts to users
async function sendJournalPrompts() {
  // Get all users from database
  const users = await User.find();

  // Loop through each user and send a journal prompt
  users.forEach(async (user) => {
    // Get user's timezone and preferred journal prompt time
    const timezone = user.timezone;
    const promptTime = user.promptTime;

    // Get current time in user's timezone
    const currentTime = new Date().toLocaleString('en-US', { timeZone: timezone });

    // If current time matches user's preferred prompt time, send prompt
    if (currentTime === promptTime) {
      // Get a random journal prompt from the list
      const prompts = ['What are you grateful for today?', 'What's something that made you smile today?', 'What did you learn today?'];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

      // Send prompt to user's phone number via Twilio
      await twilioService.sendMessage(user.phoneNumber, randomPrompt);
    }
  });
}

// Function to process user's journal response
async function processJournalResponse(userPhoneNumber, response) {
  // Find user in database
  const user = await User.findOne({ phoneNumber: userPhoneNumber });

  // Append response to user's journal document
  const journalEntry = {
    date: new Date(),
    response: response
  };
  user.journal.push(journalEntry);

  // Save updated user document to database
  await user.save();

  // Upload user's journal document to Google Docs
  await googleDocsService.uploadJournal(user);
}

// Export functions for use in journalRoutes.js
module.exports = {
  sendJournalPrompts,
  processJournalResponse
};