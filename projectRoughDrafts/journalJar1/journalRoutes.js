const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');

// Route to get all journal entries
router.get('/', journalController.getAllEntries);

// Route to get a specific journal entry by ID
router.get('/:id', journalController.getEntryById);

// Route to create a new journal entry
router.post('/', journalController.createEntry);

// Route to update an existing journal entry by ID
router.put('/:id', journalController.updateEntryById);

// Route to delete a specific journal entry by ID
router.delete('/:id', journalController.deleteEntryById);

module.exports = router;