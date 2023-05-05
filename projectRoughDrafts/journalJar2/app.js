// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const journalRoutes = require('./routes/journalRoutes');
const userRoutes = require('./routes/userRoutes');
const scheduler = require('./utils/scheduler');

// Initialize express app
const app = express();

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up journal and user routes
app.use('/journal', journalRoutes);
app.use('/user', userRoutes);

// Start the scheduler
scheduler.start();

// Set up server to listen on port 3000
app.listen(3000, () => {
  console.log('Server started on port 3000');
});