// server/config/config.js - Configuration
module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: '5c3a2e1c97a74d2b9e204b64fa6e9a59f37a80c9f50dc2d5d5e289ec5a3f4e0a',
  jwtExpiration: 86400, // 24 hours
  
  mail: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    user: "gengcangkui@gmail.com",
    password: "xego euqm xrjf mrks",  // Your app password
    from: '"UTMeBookSys" <gengcangkui@gmail.com>'
  }
};


