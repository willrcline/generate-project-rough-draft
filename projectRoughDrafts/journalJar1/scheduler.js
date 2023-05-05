// Import necessary modules and services
const cron = require('node-cron');
const twilioService = require('../services/twilioService');
const journalController = require('../controllers/journalController');

// Define the schedule for sending out text messages
// The schedule is based on the user's specified time in their settings
// The cron format is "minute hour day-of-month month day-of-week"
// For example, "0 8 * * *" means every day at 8am
const sendPromptSchedule = (user) => {
  const schedule = `${user.sendPromptMinute} ${user.sendPromptHour} * * *`;
  cron.schedule(schedule, () => {
    // Send the prompt via Twilio service
    twilioService.sendPrompt(user.phoneNumber, user.prompt)
      .then(() => {
        console.log(`Prompt sent to ${user.phoneNumber}`);
      })
      .catch((err) => {
        console.error(`Error sending prompt to ${user.phoneNumber}: ${err}`);
      });
  });
};

// Define the schedule for processing user responses
// The schedule is based on the user's specified time in their settings
// The cron format is the same as above
const processResponseSchedule = (user) => {
  const schedule = `${user.processResponseMinute} ${user.processResponseHour} * * *`;
  cron.schedule(schedule, () => {
    // Get the user's responses from Twilio service
    twilioService.getResponses(user.phoneNumber)
      .then((responses) => {
        // Append the responses to the user's journal document
        journalController.appendEntries(user.journalId, responses)
          .then(() => {
            console.log(`Responses added to journal for ${user.phoneNumber}`);
          })
          .catch((err) => {
            console.error(`Error adding responses to journal for ${user.phoneNumber}: ${err}`);
          });
      })
      .catch((err) => {
        console.error(`Error getting responses for ${user.phoneNumber}: ${err}`);
      });
  });
};

// Export the functions for use in other modules
module.exports = {
  sendPromptSchedule,
  processResponseSchedule,
};