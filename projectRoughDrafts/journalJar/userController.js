// Import necessary modules
const User = require('../models/user');
const twilioService = require('../services/twilioService');
const scheduler = require('../utils/scheduler');

// Function to create a new user
exports.createUser = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Create new user
    const newUser = new User({
      phoneNumber: req.body.phoneNumber,
      journalEntries: [],
      dailyReminderTime: req.body.dailyReminderTime
    });
    // Save user to database
    await newUser.save();
    // Schedule daily text message reminder
    scheduler.scheduleReminder(newUser);
    // Send success message
    return res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user' });
  }
};

// Function to update user settings
exports.updateSettings = async (req, res) => {
  try {
    // Find user by phone number
    const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    // Update user settings
    user.dailyReminderTime = req.body.dailyReminderTime;
    // Save updated user to database
    await user.save();
    // Reschedule daily text message reminder
    scheduler.rescheduleReminder(user);
    // Send success message
    return res.status(200).json({ message: 'User settings updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user settings' });
  }
};

// Function to handle incoming text messages
exports.handleIncomingMessage = async (req, res) => {
  try {
    // Find user by phone number
    const user = await User.findOne({ phoneNumber: req.body.From });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    // Append message to journal entries
    user.journalEntries.push(req.body.Body);
    // Save updated user to database
    await user.save();
    // Send success message
    twilioService.sendMessage(req.body.From, 'Journal entry saved successfully');
    return res.status(200).end();
  } catch (error) {
    return res.status(500).json({ message: 'Error saving journal entry' });
  }
};