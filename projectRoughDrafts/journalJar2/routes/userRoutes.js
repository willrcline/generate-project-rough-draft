// Import necessary modules and files
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route for creating a new user
router.post('/users', userController.createUser);

// Route for updating user settings
router.put('/users/:id/settings', userController.updateUserSettings);

module.exports = router;