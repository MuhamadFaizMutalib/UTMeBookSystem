// server/controllers/auth.controller.js - Authentication controller
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

// Register a new user
exports.signup = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: "Content cannot be empty!"
    });
  }

  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "Username, email and password are required!"
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