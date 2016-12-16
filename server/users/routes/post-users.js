const Boom = require('boom');
const { hasRoleInList, hasScopeInList } = require('../middlewares');
const { payload } = require('./user-validation');

module.exports = {
  method: 'POST',
  path: '/users',
  config: {
    pre: [hasScopeInList('users:create'), hasRoleInList(['rh', 'staff'])],
    validate: {
      payload: payload.post,
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const { createOVHAccount } = req.server.plugins.tasks;

    const user = new User({
      firstName: req.payload.firstName,
      lastName: req.payload.lastName,
      email: req.payload.email,
      fallbackEmail: req.payload.fallbackEmail,
      roles: req.payload.roles,
    });

    const userPromise = user
      .hashPassword(req.payload.plainPassword)
      .then(() => user.save())
      .then((savedUser) => {
        createOVHAccount({
          user: savedUser,
          email: user.email,
          plainPassword: req.payload.plainPassword,
        }).save();
        return savedUser;
      })
      .catch((err) => {
        if (err.message.startsWith('E11000')) {
          return Promise.reject(Boom.badRequest('email_already_used'));
        }
        return Promise.reject(Boom.wrap(err));
      });

    res.mongodb(userPromise, ['password']).code(201);
  },
};
