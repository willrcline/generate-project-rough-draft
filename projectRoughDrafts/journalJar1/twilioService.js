// Require the Twilio library
const twilio = require('twilio');

// Require the config file to access Twilio credentials
const config = require('../config/config');

// Create a new Twilio client with the credentials from the config file
const client = new twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

// Export a function to send a text message
exports.sendTextMessage = function(to, body) {
  // Use the Twilio client to send a text message
  client.messages.create({
    to: to,
    from: config.TWILIO_PHONE_NUMBER,
    body: body
  })
  .then((message) => console.log(`Text message sent to ${to}: ${message.body}`))
  .catch((error) => console.error(`Error sending text message to ${to}: ${error}`));
};

// Export a function to receive a text message
exports.receiveTextMessage = function(req, res) {
  // Check if the message is from a valid phone number
  if (req.body.From !== config.VALID_PHONE_NUMBER) {
    console.log(`Received text message from invalid phone number: ${req.body.From}`);
    return res.status(400).end();
  }

  // Get the message body and phone number from the request
  const body = req.body.Body;
  const from = req.body.From;

  // Log the received message
  console.log(`Received text message from ${from}: ${body}`);

  // Call the journal controller to append the message to the user's journal
  journalController.appendJournalEntry(from, body);

  // Send a response back to the user
  res.status(200).end();
};