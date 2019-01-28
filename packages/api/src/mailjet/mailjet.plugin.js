const Mailjet = require('node-mailjet');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

module.exports = {
  name: 'mailjet',
  async register(server, { apiKey, apiToken, baseUrl }) {
    const mailjetAPI = Mailjet.connect(apiKey, apiToken);
    const isMailJetEnabled = !!apiKey && !!apiToken;

    if (!isMailJetEnabled) {
      server.log('warn', 'MailJet is disabled');
    }

    fs.readFile(path.join(__dirname, 'templates/account-created.hbs'), (err, buffer) => {
      server.expose('accountCreatedTemplate', handlebars.compile(buffer.toString()));
    });

    fs.readFile(path.join(__dirname, 'templates/password-reset.hbs'), (err, buffer) => {
      server.expose('passwordResetTemplate', handlebars.compile(buffer.toString()));
    });

    function sendLVConnectEmail(emailData) {
      if (!isMailJetEnabled) {
        return Promise.resolve();
      }

      const sendEmail = mailjetAPI.post('send');

      return sendEmail.request(emailData)
        .catch(err => server.log('error', err));
    }

    server.expose('sendAccountCreationMail', (userData, token) => sendLVConnectEmail({
      FromEmail: 'no-reply@link-value.fr',
      FromName: 'LVConnect',
      Subject: 'Ton compte LVConnect est prêt !',
      'Html-part': server.plugins.mailjet.accountCreatedTemplate({ userData, token, baseUrl }),
      Recipients: [{ Email: userData.email }],
    }));

    server.expose('sendPasswordResetMail', (userData, token) => sendLVConnectEmail({
      FromEmail: 'no-reply@link-value.fr',
      FromName: 'LVConnect',
      Subject: 'Réinitialisation de ton mot de passe LVConnect',
      'Html-part': server.plugins.mailjet.passwordResetTemplate({ userData, token, baseUrl }),
      Recipients: [{ Email: userData.email }],
    }));
  },
};
