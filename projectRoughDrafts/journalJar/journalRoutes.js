// Import necessary modules and files
const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');

// Define route for receiving text message responses
router.post('/response', journalController.receiveResponse);

// Define route for creating a new journal entry
router.post('/', journalController.createEntry);

// Define route for retrieving all journal entries for a user
router.get('/:userId', journalController.getAllEntries);

// Define route for retrieving a specific journal entry
router.get('/:userId/:entryId', journalController.getEntry);

// Define route for updating a specific journal entry
router.put('/:userId/:entryId', journalController.updateEntry);

// Define route for deleting a specific journal entry
router.delete('/:userId/:entryId', journalController.deleteEntry);

// Export router
module.exports = router;