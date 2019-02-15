const Boom = require('boom');
const _ = require('lodash');
const { permissions, hooks } = require('@lvconnect/config/server');

const { hasRoleInList, hasScopeInList } = require('../../middlewares');
const { payload } = require('./user-validation');

module.exports = {
  method: 'POST',
  path: '/users',
  config: {
    pre: [hasScopeInList(['users:create']), hasRoleInList(permissions.addUser)],
    validate: {
      payload: payload.post,
    },
  },
  async handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const { githubOrgUserLink, trelloOrgUserLink } = req.server.plugins.tasks;

    const user = new User(_.omit(req.payload, ['githubHandle', 'trelloHandle', 'plainPassword']));

    await user.hashPassword(req.server.methods.uuidHash());

    let savedUser;
    try {
      savedUser = await user.save();
    } catch (err) {
      if (err.message.startsWith('E11000')) {
        return Promise.reject(Boom.badRequest('email_already_used'));
      }
      return Promise.reject(Boom.wrap(err));
    }

    if (user.githubHandle) {
      githubOrgUserLink({ user: savedUser });
    }
    if (user.trelloHandle) {
      trelloOrgUserLink({ user: savedUser });
    }

    const token = await req.server.plugins.login.createPasswordResetToken(savedUser._id.toString());
    req.server.plugins.mailjet.sendAccountCreationMail(req.payload, token);

    req.server.plugins.hooks.trigger(hooks.events.userCreated, {
      user: _.omit(savedUser.toJSON(), ['password', 'thirdParty', 'needPasswordChange']),
      sender: _.omit(req.auth.credentials.user.toJSON(), ['password', 'thirdParty', 'needPasswordChange']),
    });

    return res.mongodb(savedUser, ['password', 'thirdParty', 'needPasswordChange']);
  },
};
