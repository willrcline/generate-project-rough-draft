// Import necessary modules and controllers
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define routes for user interactions
router.get('/settings', userController.getSettingsPage);
router.post('/settings', userController.updateUserSettings);

// Export router
module.exports = router;