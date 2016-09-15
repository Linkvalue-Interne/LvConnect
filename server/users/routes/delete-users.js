const Boom = require('boom');
const { params } = require('./user-validation');

module.exports = {
  method: 'DELETE',
  path: '/users/{user}',
  config: {
    validate: {
      params,
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const userPromise = User
      .remove({ _id: req.params.user })
      .exec();

    res(userPromise);
  },
};
