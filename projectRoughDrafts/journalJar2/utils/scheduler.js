// Import necessary modules
const cron = require('node-cron');
const twilioService = require('../services/twilioService');
const userController = require('../controllers/userController');

// Define function to schedule text messages
function scheduleTextMessages() {
  // Get all users
  const users = userController.getAllUsers();

  // Loop through each user and schedule text message
  users.forEach(user => {
    // Get user's specified time for text message
    const textTime = user.settings.textTime;

    // Schedule text message using cron job
    cron.schedule(`0 ${textTime.hour} ${textTime.minute} * * *`, () => {
      // Get journal prompt for the day
      const prompt = userController.getJournalPrompt();

      // Send text message with prompt to user
      twilioService.sendTextMessage(user.phoneNumber, prompt);

      // Wait for user's response
      twilioService.receiveTextMessage(user.phoneNumber, response => {
        // Append response to user's journal document
        userController.appendJournalEntry(user.id, response);

        // Upload journal document to Google Docs API
        googleDocsService.uploadJournalDocument(user.id);
      });
    });
  });
}

// Export function
module.exports = {
  scheduleTextMessages
};