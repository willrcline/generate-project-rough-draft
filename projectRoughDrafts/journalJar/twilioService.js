// Import the Twilio module
const twilio = require('twilio');

// Import the config file
const config = require('../config/config');

// Initialize Twilio client with account SID and auth token
const client = twilio(config.twilio.accountSid, config.twilio.authToken);

// Export the function to send a text message
module.exports.sendTextMessage = function(to, body) {
  // Use the Twilio client to send a text message
  client.messages.create({
    to: to,
    from: config.twilio.fromNumber,
    body: body
  })
  .then((message) => console.log(`Text message sent to ${to}: ${message.sid}`))
  .catch((error) => console.error(`Error sending text message to ${to}: ${error.message}`));
};

// Export the function to receive a text message
module.exports.receiveTextMessage = function(req, res) {
  // Get the incoming message body and phone number
  const body = req.body.Body;
  const from = req.body.From;

  // Log the incoming message
  console.log(`Incoming text message from ${from}: ${body}`);

  // Send a response message
  const response = 'Thank you for your response!';
  res.send(response);
};