// server/services/otp.service.js - OTP service
const pool = require('../config/database');

// Generate a random 6-digit OTP
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Save OTP in database (valid for 10 minutes)
exports.saveOTP = async (email, otp, result) => {
  try {
    // Check if OTP record exists for this email
    const checkRes = await pool.query(
      "SELECT * FROM otps WHERE email = $1",
      [email]
    );
    
    // Current timestamp plus 10 minutes for expiration
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    if (checkRes.rows.length) {
      // Update existing OTP
      await pool.query(
        "UPDATE otps SET otp = $1, expires_at = $2 WHERE email = $3",
        [otp, expiresAt, email]
      );
    } else {
      // Create new OTP record
      await pool.query(
        "INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3)",
        [email, otp, expiresAt]
      );
    }
    
    result(null, { email, otp });
  } catch (err) {
    console.log("Error saving OTP: ", err);
    result(err, null);
  }
};

// Verify OTP
exports.verifyOTP = async (email, otp, result) => {
  try {
    const res = await pool.query(
      "SELECT * FROM otps WHERE email = $1 AND otp = $2 AND expires_at > NOW()",
      [email, otp]
    );
    
    if (res.rows.length) {
      // OTP is valid
      result(null, true);
    } else {
      // OTP is invalid or expired
      result({ message: "Invalid or expired OTP" }, false);
    }
  } catch (err) {
    console.log("Error verifying OTP: ", err);
    result(err, false);
  }
};

// Remove OTP after successful verification
exports.removeOTP = async (email) => {
  try {
    await pool.query(
      "DELETE FROM otps WHERE email = $1",
      [email]
    );
    return true;
  } catch (err) {
    console.log("Error removing OTP: ", err);
    return false;
  }
};