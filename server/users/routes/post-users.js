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

    const userPromise = user
      .hashPassword(req.payload.plainPassword)
      .then(() => user.save())
      .then((persistedUser) => {
        // We gonna split the email to get user@domain.ext
        // We need it later to request OVH API.
        const emailParts = {
          user: null,
          domain: null,
          ext: null,
        };
        req.payload.email.replace(
          new RegExp('^(.+)@(.+)\\.(\\w+)$', 'i'), ($0, $1, $2, $3) => {
            emailParts.user = $1;
            emailParts.domain = $2;
            emailParts.ext = $3;
          }
        );

        ovh.request('POST', `/email/domain/${emailParts.domain}.${emailParts.ext}/account`, {
          accountName: emailParts.user,
          password: req.payload.plainPassword,
        });

        return persistedUser;
      });

    res.mongodb(userPromise, ['password']);
  },
};
