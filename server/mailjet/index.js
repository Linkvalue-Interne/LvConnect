const Mailjet = require('node-mailjet');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

exports.register = (server, { apiKey, apiToken }, next) => {
  const mailjetAPI = Mailjet.connect(apiKey, apiToken);
  const isMailJetEnabled = !!apiKey && !!apiToken;

  if (!isMailJetEnabled) {
    server.log('warn', 'MailJet is disabled');
  }

  fs.readFile(path.join(__dirname, 'templates/account-created.hbs'), (err, buffer) => {
    server.expose('accountCreatedTemplate', handlebars.compile(buffer.toString()));
  });

  server.expose('sendAccountCreationMail', (userData) => {
    if (!isMailJetEnabled) {
      return Promise.resolve();
    }

    const sendEmail = mailjetAPI.post('send');

    const emailData = {
      FromEmail: 'no-reply@link-value.fr',
      FromName: 'LVConnect',
      Subject: 'Your LVConnect account is ready',
      'Html-part': server.plugins.mailjet.accountCreatedTemplate({ userData }),
      Recipients: [{ Email: userData.email }],
    };

    return sendEmail.request(emailData)
      .catch(err => server.log('error', err));
  });

  server.route({
    method: 'GET',
    path: '/test',
    config: { auth: false },
    handler(req, res) {
      req.server.plugins.mailjet.sendAccountCreationMail();
      res('Hello');
    },
  });

  next();
};

exports.register.attributes = {
  name: 'mailjet',
  version: '0.0.1',
};
