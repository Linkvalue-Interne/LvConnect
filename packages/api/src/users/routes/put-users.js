const Boom = require('boom');
const _ = require('lodash');
const { permissions, hooks } = require('@lvconnect/config/server');

const { hasRoleInList, isConnectedUser, hasScopeInList } = require('../../middlewares');
const { payload, params } = require('./user-validation');

module.exports = {
  method: 'PUT',
  path: '/users/{user}',
  config: {
    pre: [
      hasScopeInList(['users:modify', 'profile:modify']),
      isConnectedUser,
      hasRoleInList(permissions.editUser, true),
    ],
    validate: {
      payload: payload.put,
      params,
    },
  },
  async handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const { isConnectedUser: isSelf, hasRights, scopes } = req.pre;
    const hasEditAnyUserScope = scopes.indexOf('users:modify') >= 0;
    const hasEditSelfScope = scopes.indexOf('profile:modify') >= 0;
    const { githubOrgUserLink, trelloOrgUserLink } = req.server.plugins.tasks;

    // Check can edit other users
    if (!isSelf && (!hasRights || !hasEditAnyUserScope)) {
      throw Boom.forbidden('insufficient_rights');
    }

    // Check can edit self
    if (isSelf && !hasEditSelfScope && !hasEditAnyUserScope) {
      throw Boom.forbidden('insufficient_rights');
    }

    // User can't edit his roles if doesn't have rights.
    if (isSelf && !hasRights && (req.payload.roles || req.payload.registrationNumber)) {
      throw Boom.forbidden('insufficient_rights');
    }

    const user = await User.findById(req.params.user);

    if (!user) {
      throw Boom.notFound('User Not Found');
    }

    const oldUser = user.toJSON();
    Object.assign(user, req.payload);
    Object.entries(req.payload).forEach(([key, value]) => {
      if (value === null) {
        user[key] = undefined;
      }
    });

    await user.save();

    if (user.githubHandle && user.thirdParty.github !== 'success') {
      githubOrgUserLink({ user });
    }
    if (user.trelloHandle && user.thirdParty.trello !== 'success') {
      trelloOrgUserLink({ user });
    }

    req.server.plugins.hooks.trigger(hooks.events.userModified, {
      oldUser: _.omit(oldUser, ['thirdParty', 'needPasswordChange']),
      user: _.omit(user.toJSON(), ['thirdParty', 'needPasswordChange']),
      sender: _.omit(req.auth.credentials.user.toJSON(), ['thirdParty', 'needPasswordChange']),
    });

    return res.mongodb(user, ['thirdParty', 'needPasswordChange']);
  },
};
