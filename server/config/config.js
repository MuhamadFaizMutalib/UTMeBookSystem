// server/config/config.js - Configuration
module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: '5c3a2e1c97a74d2b9e204b64fa6e9a59f37a80c9f50dc2d5d5e289ec5a3f4e0a',
  jwtExpiration: 86400, // 24 hours
  
  // Add email configuration
  // mail: {
  //   host: "smtp.example.com", // SMTP host (e.g., smtp.gmail.com)
  //   port: 587, // SMTP port
  //   secure: false, // true for 465, false for other ports
  //   user: "your-email@example.com", // SMTP username
  //   password: "your-email-password", // SMTP password
  //   from: '"UTMeBookSys" <your-email@example.com>' // Sender address
  // }

  mail: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    user: "gengcangkui@gmail.com",
    password: "xego euqm xrjf mrks",  // Your app password
    from: '"UTMeBookSys" <gengcangkui@gmail.com>'
  }
};


