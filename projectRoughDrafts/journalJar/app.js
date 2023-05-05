// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const journalRoutes = require('./routes/journalRoutes');
const userRoutes = require('./routes/userRoutes');
const scheduler = require('./utils/scheduler');

// Create express app
const app = express();

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize routes
app.use('/journal', journalRoutes);
app.use('/user', userRoutes);

// Start the scheduler
scheduler.start();

// Set up server to listen on port 3000
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});