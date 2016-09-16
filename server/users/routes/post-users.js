const { payload } = require('./user-validation');
const config = require('config');
const ovh = require('ovh')(config.ovh);

module.exports = {
  method: 'POST',
  path: '/users',
  config: {
    validate: {
      payload,
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    const user = new User({
      firstName: req.payload.firstName,
      lastName: req.payload.lastName,
      email: req.payload.email,
    });

    // We gonna split the email to get username@domain.ext
    // We need it later to request OVH API.
    const [, username, domain, ext] = user.email.match(/^(.+)@(.+)\.(\w+)$/i);

    const userPromise = ovh.requestPromised('POST', `/email/domain/${domain}.${ext}/account`, {
      accountName: username,
      password: req.payload.plainPassword,
    })
      .then(() => user.hashPassword(req.payload.plainPassword))
      .then(() => user.save());

    res.mongodb(userPromise, ['password']);
  },
};
