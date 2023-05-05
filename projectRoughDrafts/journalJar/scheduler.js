// Import necessary modules
const schedule = require('node-schedule');
const twilioService = require('../services/twilioService');
const journalController = require('../controllers/journalController');

// Define function to set up daily schedule
function setDailySchedule(user) {
  // Get user's preferred time for receiving journal prompts
  const { promptTime } = user.settings;

  // Set up schedule for sending journal prompts
  const promptSchedule = schedule.scheduleJob(`0 ${promptTime.hour} ${promptTime.minute} * * *`, () => {
    // Send journal prompt via Twilio API
    twilioService.sendJournalPrompt(user.phone);
  });

  // Set up schedule for processing user's response to journal prompt
  const responseSchedule = schedule.scheduleJob(`0 ${promptTime.hour + 1} ${promptTime.minute} * * *`, async () => {
    // Get user's response to journal prompt
    const response = await twilioService.getJournalResponse(user.phone);

    // Append response to user's journal document
    await journalController.appendJournalEntry(user.id, response);

    // Upload journal document to Google Docs API
    await googleDocsService.uploadJournalDocument(user.id);
  });
}

module.exports = {
  setDailySchedule,
};