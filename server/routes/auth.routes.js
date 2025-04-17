// server/routes/auth.routes.js - Authentication routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Register a new user
router.post('/signup', authController.signup);

// User login
router.post('/signin', authController.signin);

// Check if email exists
router.post('/check-email', authController.checkEmail);

// Send OTP
router.post('/send-otp', authController.sendOtp);

// Verify OTP
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;