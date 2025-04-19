// server/middleware/authJwt.js - JWT Authentication middleware
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const verifyToken = (req, res, next) => {
  // Get token from header
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  
  // Check if token exists
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  
  // Remove Bearer prefix if it exists
  const tokenValue = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
  
  // Verify token
  jwt.verify(tokenValue, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    
    // Store user id in request for later use
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).send({
      message: "Require Admin Role!"
    });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin
};