// Import Twilio module
const twilio = require('twilio');

// Import config file
const config = require('../config/config');

// Initialize Twilio client
const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

// Function to send a text message
async function sendTextMessage(to, body) {
  try {
    // Send text message using Twilio API
    await client.messages.create({
      to: to,
      from: config.twilio.phoneNumber,
      body: body
    });
  } catch (error) {
    console.log(error);
  }
}

// Function to receive a text message
async function receiveTextMessage(req, res) {
  try {
    // Get the text message body and phone number
    const body = req.body.Body;
    const from = req.body.From;

    // Store the text message in the journal document
    await journalController.appendJournalEntry(from, body);

    // Send a confirmation text message
    sendTextMessage(from, 'Thank you for your journal entry!');

    // Send a response to Twilio
    res.send('<Response></Response>');
  } catch (error) {
    console.log(error);
  }
}

// Export functions
module.exports = {
  sendTextMessage,
  receiveTextMessage
};