const Boom = require('boom');
const _ = require('lodash');
const { permissions, hooks } = require('@lvconnect/config/server');

const { hasRoleInList, isConnectedUser, hasScopeInList } = require('../../middlewares');
const { payload, params } = require('./user-validation');
const filter = require('lodash/pickBy');

module.exports = {
  method: 'PUT',
  path: '/users/{user}',
  config: {
    pre: [
      hasScopeInList('users:modify', 'profile:modify'),
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
    const hasEditAnyUserScope = scopes.indexOf('users:modify') !== -1;
    const hasEditSelfScope = scopes.indexOf('profile:modify') !== -1;
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

    const updates = filter({
      $set: filter(req.payload, value => value !== null),
      $unset: filter(req.payload, value => value === null),
    }, update => Object.keys(update).length);

    const savedUser = await User
      .findOneAndUpdate({ _id: req.params.user }, updates, { new: true, runSettersOnQuery: true });

    if (!savedUser) {
      throw Boom.notFound('User Not Found');
    }

    if (savedUser.githubHandle && savedUser.thirdParty.github !== 'success') {
      githubOrgUserLink({ user: savedUser });
    }
    if (savedUser.trelloHandle && savedUser.thirdParty.trello !== 'success') {
      trelloOrgUserLink({ user: savedUser });
    }

    req.server.plugins.hooks.trigger(hooks.events.userCreated, {
      user: _.omit(savedUser.toJSON(), ['password', 'thirdParty', 'needPasswordChange']),
      sender: _.omit(req.auth.credentials.user.toJSON(), ['password', 'thirdParty', 'needPasswordChange']),
    });

    return res.mongodb(savedUser, ['password', 'thirdParty', 'needPasswordChange']);
  },
};
