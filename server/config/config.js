// server/config/config.js - Server configuration
module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: 'your-secret-key', // Use environment variables in production
    jwtExpiration: 86400 // 24 hours
  };