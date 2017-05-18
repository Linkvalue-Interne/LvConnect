/* eslint-disable no-console */

const { mongodb, mailjet } = require('config');
const Mailjet = require('node-mailjet');
const mongoose = require('mongoose');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

mongoose.Promise = global.Promise;

const User = require('../server/users/models/user.model');

const templatePath = path.join(__dirname, '../server/mailjet/templates/account-created.hbs');
const emailTemplate = handlebars.compile(fs.readFileSync(templatePath).toString());

module.exports = (email) => {
  if (!mailjet.apiKey || !mailjet.apiToken) {
    console.error('Mailjet API credentials not found, be sure to register them in your local configuration file' +
      '(./config/local.{js,json,yml})');
    process.exit(1);
  }

  const mailjetAPI = Mailjet.connect(mailjet.apiKey, mailjet.apiToken);
  const sendEmail = mailjetAPI.post('send');

  const userPart = mongodb.username ? `${mongodb.username}:${mongodb.password}@` : '';
  mongoose.connect(`mongodb://${userPart}${mongodb.host}:${mongodb.port}/${mongodb.database}`, mongodb.config)
    .then(() => User.find(email ? { email } : {}))
    .then(users => Promise.all(users.map((userData) => {
      const emailData = {
        FromEmail: 'no-reply@link-value.fr',
        FromName: 'LVConnect',
        Subject: 'Your LVConnect account is ready',
        'Html-part': emailTemplate({
          userData: Object.assign({}, userData.toJSON(), { plainPassword: 'Bonjour1234' }),
        }),
        Recipients: [{ Email: userData.email }],
      };

      return sendEmail.request(emailData).then(() => console.log(`Email sent to: ${userData.email}`));
    })))
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};
