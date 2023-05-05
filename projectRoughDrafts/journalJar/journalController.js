// Import necessary modules and services
const Journal = require('../models/journal');
const User = require('../models/user');
const twilioService = require('../services/twilioService');
const googleDocsService = require('../services/googleDocsService');

// Define journalController object
const journalController = {};

// Function to send journal prompts to users
journalController.sendJournalPrompt = async () => {
  try {
    // Get all users from database
    const users = await User.find();
    // Loop through each user
    users.forEach(async (user) => {
      // Get user's timezone and preferred journal prompt time
      const timezone = user.timezone;
      const promptTime = user.promptTime;
      // Get current time in user's timezone
      const currentTime = new Date().toLocaleString('en-US', { timeZone: timezone });
      // Check if current time matches user's preferred prompt time
      if (currentTime === promptTime) {
        // Send journal prompt to user via Twilio
        await twilioService.sendMessage(user.phoneNumber, user.prompt);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// Function to process user's journal response
journalController.processJournalResponse = async (req, res) => {
  try {
    // Get user's phone number and journal response from request
    const { From, Body } = req.body;
    // Find user in database by phone number
    const user = await User.findOne({ phoneNumber: From });
    // Get current date and time in user's timezone
    const timezone = user.timezone;
    const currentDate = new Date().toLocaleString('en-US', { timeZone: timezone });
    // Create new journal entry with user's response and current date/time
    const journalEntry = new Journal({
      user: user._id,
      date: currentDate,
      entry: Body
    });
    // Save journal entry to database
    await journalEntry.save();
    // Append journal entry to user's Google Docs document
    await googleDocsService.appendDocument(user.googleDocsId, Body, currentDate);
    // Send confirmation message to user
    await twilioService.sendMessage(user.phoneNumber, 'Thank you for your journal entry!');
    res.status(200).send('Journal entry saved successfully.');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error processing journal entry.');
  }
};

// Export journalController object
module.exports = journalController;