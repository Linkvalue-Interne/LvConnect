const Boom = require('boom');
const { params } = require('./user-validation');
const { hasScopeInList } = require('../../middlewares');

module.exports = {
  method: 'GET',
  path: '/users/{user}',
  config: {
    pre: [hasScopeInList(['users:get', 'profile:get'])],
    validate: {
      params,
    },
  },
  handler(req, res) {
    const { scopes, user: connectedUser } = req.auth.credentials;
    const requestedUserIsTheConnectedOne = connectedUser && req.params.user === connectedUser._id;

    if (!scopes.includes('users:get') && !requestedUserIsTheConnectedOne) {
      throw Boom.forbidden('Insufficient rights');
    }

    const { User } = req.server.plugins.users.models;

    const userPromise = User
      .findOne({ _id: req.params.user })
      .select('-password -thirdParty -needPasswordChange')
      .exec()
      .then((user) => {
        if (!user) {
          throw Boom.notFound('User Not Found');
        }

        return user;
      });

    return res.mongodb(userPromise);
  },
};
