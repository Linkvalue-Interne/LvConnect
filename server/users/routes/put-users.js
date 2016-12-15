const Boom = require('boom');
const { hasRoleInList, isConnectedUser, rightsError } = require('../middlewares');
const { payload, params } = require('./user-validation');

module.exports = {
  method: 'PUT',
  path: '/users/{user}',
  config: {
    pre: [isConnectedUser, hasRoleInList('rh', 'staff')],
    validate: {
      payload: payload.put,
      params,
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    // User can't edit his roles if doesn't have rights.
    if (req.pre.isOwner && !req.pre.hasRights && req.payload.roles) {
      return res(rightsError);
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
