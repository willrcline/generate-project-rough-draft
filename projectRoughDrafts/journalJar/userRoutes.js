const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to retrieve user settings page
router.get('/settings', userController.getSettings);

// Route to update user settings
router.post('/settings', userController.updateSettings);

module.exports = router;