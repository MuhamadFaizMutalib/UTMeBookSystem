// server/services/email.service.js - Email service
const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.secure,
  auth: {
    user: config.mail.user,
    pass: config.mail.password
  }
});

// Send email function
exports.sendEmail = async (to, subject, html, callback) => {
  try {
    const mailOptions = {
      from: config.mail.from,
      to: to,
      subject: subject,
      html: html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    callback(null, info);
  } catch (error) {
    console.error('Error sending email:', error);
    callback(error, null);
  }
};