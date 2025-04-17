// server/models/user.model.js - User model
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Constructor
const User = function(user) {
  this.username = user.username;
  this.email = user.email;
  this.password = user.password;
};

// Create a new user
User.create = async (newUser, result) => {
  try {
    // Hash password before saving
    const salt = bcrypt.genSaltSync(10);
    newUser.password = bcrypt.hashSync(newUser.password, salt);
    
    const res = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
      [newUser.username, newUser.email, newUser.password]
    );
    
    console.log("Created user: ", { id: res.rows[0].id, ...newUser });
    result(null, { id: res.rows[0].id, ...newUser });
  } catch (err) {
    console.log("Error: ", err);
    result(err, null);
  }
};

// Find user by email
User.findByEmail = async (email, result) => {
  try {
    const res = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    
    if (res.rows.length) {
      console.log("Found user: ", res.rows[0]);
      result(null, res.rows[0]);
      return;
    }
    
    // User not found
    result({ kind: "not_found" }, null);
  } catch (err) {
    console.log("Error: ", err);
    result(err, null);
  }
};

module.exports = User;