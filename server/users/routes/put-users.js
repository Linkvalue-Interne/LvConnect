const Boom = require('boom');
const { hasRoleInList, isConnectedUser, hasScopeInList } = require('../middlewares');
const { payload, params } = require('./user-validation');

module.exports = {
  method: 'PUT',
  path: '/users/{user}',
  config: {
    pre: [hasScopeInList('users:modify', 'profile:modify'), isConnectedUser, hasRoleInList(['rh', 'staff'], true)],
    validate: {
      payload: payload.put,
      params,
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const { isConnectedUser: isSelf, hasRights, scopes } = req.pre;
    const hasEditAnyUserScope = scopes.indexOf('users:modify') !== -1;
    const hasEditSelfScope = scopes.indexOf('profile:modify') !== -1;

    // Check can edit other users
    if (!isSelf && (!hasRights || !hasEditAnyUserScope)) {
      return res(Boom.forbidden('insufficient_rights'));
    }

    // Check can edit self
    if (isSelf && !hasEditSelfScope && !hasEditAnyUserScope) {
      return res(Boom.forbidden('insufficient_rights'));
    }

    // User can't edit his roles if doesn't have rights.
    if (isSelf && !hasRights && req.payload.roles) {
      return res(Boom.forbidden('insufficient_rights'));
    }

    const userPromise = User
      .findOne({ _id: req.params.user })
      .exec()
      .then((user) => {
        if (!user) {
          return Promise.reject(Boom.notFound('User Not Found'));
        }

        return Object
          .assign(user, {
            firstName: req.payload.firstName || user.firstName,
            lastName: req.payload.lastName || user.lastName,
            fallbackEmail: req.payload.fallbackEmail || user.fallbackEmail,
            roles: req.payload.roles || user.roles,
          })
          .save();
      });

    return res.mongodb(userPromise, ['password']);
  },
};
