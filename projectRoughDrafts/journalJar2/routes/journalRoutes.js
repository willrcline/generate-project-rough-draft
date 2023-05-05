// Import necessary modules and services
const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const twilioService = require('../services/twilioService');

// Route for sending daily journal prompts via text message
router.post('/sendPrompt', async (req, res) => {
  try {
    // Retrieve user's phone number from database using user ID in request body
    const phoneNumber = await journalController.getUserPhoneNumber(req.body.userId);

    // Generate a random journal prompt from a list of prompts
    const prompt = journalController.generatePrompt();

    // Send the prompt via text message using Twilio API
    await twilioService.sendMessage(phoneNumber, prompt);

    res.status(200).send('Prompt sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending prompt');
  }
});

// Route for processing user's journal response
router.post('/processResponse', async (req, res) => {
  try {
    // Retrieve user's journal document from Google Docs API using user ID in request body
    const journalDoc = await journalController.getJournalDoc(req.body.userId);

    // Append user's response to the journal document
    await journalController.appendResponse(journalDoc, req.body.response);

    res.status(200).send('Response processed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing response');
  }
});

module.exports = router;