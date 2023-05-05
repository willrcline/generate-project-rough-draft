// Import necessary modules and models
const User = require('../models/user');
const twilioService = require('../services/twilioService');

// Function to create a new user
exports.createUser = async (req, res) => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      phoneNumber: req.body.phoneNumber,
      dailyPromptTime: req.body.dailyPromptTime
    });

    // Save user to database
    await user.save();

    // Send welcome message
    await twilioService.sendMessage(req.body.phoneNumber, 'Welcome to our journaling app!');

    // Return success message
    return res.status(200).json({ message: 'User created successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating user' });
  }
};

// Function to update user settings
exports.updateUserSettings = async (req, res) => {
  try {
    // Find user by phone number
    const user = await User.findOne({ phoneNumber: req.params.phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's daily prompt time
    user.dailyPromptTime = req.body.dailyPromptTime;

    // Save updated user to database
    await user.save();

    // Return success message
    return res.status(200).json({ message: 'User settings updated successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating user settings' });
  }
};