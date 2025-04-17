// server/controllers/auth.controller.js - Authentication controller
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const otpService = require('../services/otp.service');
const emailService = require('../services/email.service');

// Check if email exists
exports.checkEmail = async (req, res) => {
  try {
    // Validate request
    if (!req.body.email) {
      return res.status(400).send({
        message: "Email is required!"
      });
    }
    
    // Check if email is in valid format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).send({
        message: "Invalid email format!"
      });
    }
    
    // Check if email already exists
    User.findByEmail(req.body.email, (err, user) => {
      if (err) {
        if (err.kind === "not_found") {
          // Email does not exist
          return res.send({ exists: false });
        }
        return res.status(500).send({
          message: "Error checking email"
        });
      }
      
      // Email exists
      res.send({ exists: true });
    });
  } catch (error) {
    res.status(500).send({
      message: "Error checking email"
    });
  }
};

// Send OTP to user's email
exports.sendOtp = async (req, res) => {
  try {
    // Validate request
    if (!req.body.email) {
      return res.status(400).send({
        message: "Email is required!"
      });
    }
    
    // Generate OTP
    const otp = otpService.generateOTP();
    
    // Save OTP in database
    otpService.saveOTP(req.body.email, otp, (err, data) => {
      if (err) {
        return res.status(500).send({
          message: "Failed to generate OTP"
        });
      }
      
      // Send OTP via email
      const subject = "Your Verification Code";
      const body = `Hello ${req.body.username || 'User'},<br><br>
                   Your verification code is: <strong>${otp}</strong><br><br>
                   This code will expire in 10 minutes.<br><br>
                   If you did not request this code, please ignore this email.`;
      
      emailService.sendEmail(req.body.email, subject, body, (err, info) => {
        if (err) {
          return res.status(500).send({
            message: "Failed to send OTP email"
          });
        }
        
        res.send({
          message: "OTP sent successfully!"
        });
      });
    });
  } catch (error) {
    res.status(500).send({
      message: "Error sending OTP"
    });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    // Validate request
    if (!req.body.email || !req.body.otp) {
      return res.status(400).send({
        message: "Email and OTP are required!"
      });
    }
    
    // Verify OTP
    otpService.verifyOTP(req.body.email, req.body.otp, (err, valid) => {
      if (err || !valid) {
        return res.status(400).send({
          message: "Invalid or expired OTP"
        });
      }
      
      res.send({
        message: "OTP verified successfully!"
      });
    });
  } catch (error) {
    res.status(500).send({
      message: "Error verifying OTP"
    });
  }
};

// Register a new user
exports.signup = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: "Content cannot be empty!"
    });
  }

  if (!req.body.username || !req.body.email || !req.body.password || !req.body.otp) {
    return res.status(400).send({
      message: "Username, email, password and verification code are required!"
    });
  }
  
  // Verify OTP one more time
  otpService.verifyOTP(req.body.email, req.body.otp, (err, valid) => {
    if (err || !valid) {
      return res.status(400).send({
        message: "Invalid or expired verification code"
      });
    }
    
    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(req.body.password)) {
      return res.status(400).send({
        message: "Password does not meet requirements"
      });
    }

    // Create a new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    // Save user in the database
    User.create(user, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the user."
        });
        return;
      }
      
      // Remove OTP after successful registration
      otpService.removeOTP(req.body.email);
      
      // Generate token
      const token = jwt.sign({ id: data.id }, config.jwtSecret, {
        expiresIn: config.jwtExpiration
      });
      
      // Return user and token
      res.send({
        message: "User registered successfully!",
        user: {
          id: data.id,
          username: data.username,
          email: data.email
        },
        token: token
      });
    });
  });
};

// User login
exports.signin = (req, res) => {
  // Validate request
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "Email and password are required!"
    });
  }

  // Find user by email
  User.findByEmail(req.body.email, (err, user) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: "User not found with email " + req.body.email
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with email " + req.body.email
      });
    }
    
    // Verify password
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid password!",
        token: null
      });
    }
    
    // Generate token
    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiration
    });
    
    // Return user and token
    res.send({
      message: "Login successful!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token: token
    });
  });
};