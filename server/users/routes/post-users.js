const { payload } = require('./user-validation');
const config = require('config');
const ovh = require('ovh')(config.ovh);

module.exports = {
  method: 'POST',
  path: '/users',
  config: {
    validate: {
      payload: payload.post,
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const { createThirdPartyAccounts } = req.server.plugins.tasks;

    const user = new User({
      firstName: req.payload.firstName,
      lastName: req.payload.lastName,
      email: req.payload.email,
      fallbackEmail: req.payload.fallbackEmail,
    });

    res.mongodb(user
      .hashPassword(req.payload.plainPassword)
      .then(() => user.save())
      .then((savedUser) => {
        createThirdPartyAccounts({
          email: user.email,
          plainPassword: req.payload.plainPassword,
        }).save();
        return savedUser;
      }), ['password']);
  },
};
