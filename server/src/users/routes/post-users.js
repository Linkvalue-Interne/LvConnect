const Boom = require('boom');
const { hasRoleInList, hasScopeInList } = require('../middlewares');
const { payload } = require('./user-validation');

module.exports = {
  method: 'POST',
  path: '/users',
  config: {
    pre: [hasScopeInList('users:create'), hasRoleInList(['rh', 'board'])],
    validate: {
      payload: payload.post,
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const { githubOrgUserLink, trelloOrgUserLink } = req.server.plugins.tasks;

    const user = new User({
      firstName: req.payload.firstName,
      lastName: req.payload.lastName,
      email: req.payload.email,
      roles: req.payload.roles,
    });

    const userPromise = user
      .hashPassword(req.payload.plainPassword)
      .then(() => user.save())
      .then((savedUser) => {
        if (user.githubHandle) {
          githubOrgUserLink({ user: savedUser });
        }
        if (user.trelloHandle) {
          trelloOrgUserLink({ user: savedUser });
        }
        req.server.plugins.mailjet.sendAccountCreationMail(req.payload);
        return savedUser;
      })
      .catch((err) => {
        if (err.message.startsWith('E11000')) {
          return Promise.reject(Boom.badRequest('email_already_used'));
        }
        return Promise.reject(Boom.wrap(err));
      });

    res.mongodb(userPromise, ['password', 'thirdParty', 'needPasswordChange']).code(201);
  },
};
