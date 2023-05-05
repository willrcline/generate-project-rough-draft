// Import necessary modules and models
const User = require('../models/user');
const twilioService = require('../services/twilioService');
const scheduler = require('../utils/scheduler');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { phoneNumber, journalTime } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      phoneNumber,
      journalTime
    });

    // Save user to database
    await newUser.save();

    // Schedule daily journal prompts
    scheduler.scheduleJournalPrompts(newUser);

    // Send confirmation message
    twilioService.sendMessage(phoneNumber, `Welcome to our journaling app! You will receive daily prompts at ${journalTime}.`);
    
    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user settings
exports.updateUserSettings = async (req, res) => {
  try {
    const { phoneNumber, journalTime } = req.body;

    // Find user in database
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user settings
    user.journalTime = journalTime;

    // Save updated user to database
    await user.save();

    // Reschedule daily journal prompts
    scheduler.rescheduleJournalPrompts(user);

    // Send confirmation message
    twilioService.sendMessage(phoneNumber, `Your journaling app settings have been updated. You will now receive daily prompts at ${journalTime}.`);
    
    res.status(200).json({ message: 'User settings updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};