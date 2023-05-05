// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const journalRoutes = require('./routes/journalRoutes');
const userRoutes = require('./routes/userRoutes');
const scheduler = require('./utils/scheduler');

// Initialize express app
const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up routes
app.use('/journal', journalRoutes);
app.use('/user', userRoutes);

// Start scheduler
scheduler.start();

// Set up server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});