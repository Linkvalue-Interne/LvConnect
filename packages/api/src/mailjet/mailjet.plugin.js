const nodemailer = require('nodemailer');
const previewEmail = require('preview-email');
const catboxRedis = require('@hapi/catbox-redis');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');
const entities = require('html-entities');
const { promisify } = require('util');

const pfs = promisify(fs.readFile);

module.exports = {
  name: 'mailjet',
  async register(server, options) {
    const transport = nodemailer.createTransport({
      service: 'Mailjet',
      auth: {
        user: options.apiKey,
        pass: options.apiToken,
      },
    });
    const isMailJetEnabled = !!options.apiKey && !!options.apiToken;

    if (!isMailJetEnabled) {
      server.log('warn', 'MailJet is disabled');
    }

    if (options.emailStore) {
      const { segment, ...cacheOptions } = options.emailStore;
      await server.cache.provision({
        name: 'emailsCache',
        provider: { constructor: catboxRedis, options: cacheOptions },
      });
      // eslint-disable-next-line no-param-reassign
      server.app.emailsCache = server.cache({ cache: 'emailsCache', expiresIn: 1000 * 60 * 60, segment });
    }

    const accountCreatedTemplate = await pfs(path.join(__dirname, 'templates/account-created.hbs'));
    const passwordResetTemplate = await pfs(path.join(__dirname, 'templates/password-reset.hbs'));
    const accountCreated = handlebars.compile(accountCreatedTemplate.toString());
    const passwordReset = handlebars.compile(passwordResetTemplate.toString());

    const templates = { accountCreated, passwordReset };

    async function send(template, data, message) {
      const email = {
        ...message,
        html: templates[template](data),
        from: `"${options.fromName}" ${options.fromEmail}`,
      };

      try {
        if (options.preview) {
          const emailId = `${template}_${message.to}`;
          const url = await previewEmail(email, emailId, !options.emailStore);
          if (options.emailStore) {
            await server.app.emailsCache.set(emailId, url);
          }
        }
        if (options.send) {
          await transport.sendMail(email);
          server.log(['info', 'emails'], `Sent email [${template}] to ${message.to}`);
        }
      } catch (e) {
        server.log(['error', 'emails'], e);
      }
    }

    const { baseUrl } = options;

    server.expose('sendAccountCreationMail', (userData, token) => send(
      'accountCreated',
      { userData, token, baseUrl },
      {
        subject: 'Ton compte LVConnect est prêt !',
        to: userData.email,
      },
    ));

    server.expose('sendPasswordResetMail', (userData, token) => send(
      'passwordReset',
      { userData, token, baseUrl },
      {
        subject: 'Réinitialisation de ton mot de passe LVConnect',
        to: userData.email,
      },
    ));

    if (options.emailStore) {
      server.route({
        method: 'GET',
        path: '/testing/emails/{emailId}',
        config: {
          auth: false,
        },
        async handler(req) {
          const { emailId } = req.params;
          const emailUrl = await server.app.emailsCache.get(emailId);
          const emailFile = fs.readFileSync(emailUrl.slice(7)).toString();
          const [emailContent] = emailFile.match(/srcdoc="(\s|.)*"/);
          return entities.XmlEntities.decode(emailContent)
            .slice(8, -1)
            .replace("<base target='_top'>", '<DOCTYPE !html>');
        },
      });
    }
  },
};
