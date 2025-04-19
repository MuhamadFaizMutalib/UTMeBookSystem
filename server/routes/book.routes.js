// server/routes/book.routes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const authJwt = require('../middleware/authJwt');

// Apply JWT authentication middleware to all routes
router.use(authJwt.verifyToken);

// Upload cover image
router.post('/upload-cover', bookController.uploadCoverImage);

// Create a new book
router.post('/', bookController.create);

// Get all books
router.get('/', bookController.findAll);

// Get books by user ID
router.get('/user/:userId', bookController.findByUserId);

module.exports = router;