// server/server.js - Main server file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const config = require('./server/config/config');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './client')));

// Routes
app.use('/api/auth', require('./server/routes/auth.routes'));

// Serve the AngularJS app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/index.html'));
});

// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
















