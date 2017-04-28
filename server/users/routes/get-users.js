const Boom = require('boom');
const { params } = require('./user-validation');
const { hasScopeInList } = require('../middlewares');

module.exports = {
  method: 'GET',
  path: '/users/{user}',
  config: {
    pre: [hasScopeInList('users:get', 'profile:get')],
    validate: {
      params,
    },
  },
  handler(req, res) {
    const { scopes, user: { _id } } = req.auth.credentials;
    if (scopes.indexOf('users:get') === -1 && req.params.user !== _id) {
      return res(Boom.forbidden('Insufficient rights'));
    }

    const { User } = req.server.plugins.users.models;

    const userPromise = User
      .findOne({ _id: req.params.user })
      .select('-password')
      .exec()
      .then((user) => {
        if (!user) {
          return Boom.notFound('User Not Found');
        }

        return user;
      });

    return res.mongodb(userPromise);
  },
};
