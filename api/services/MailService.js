const MailerService = require('sails-service-mailer');

module.exports = MailerService('smtp', {
  from: 'ameinfomailservice@gmail.com',
  provider: {
    port: 587,
    host: 'smtp.gmail.com',
    auth: {
      user: 'ameinfomailservice@gmail.com',
      pass: 'Abc!123456',
    },
  }
});
