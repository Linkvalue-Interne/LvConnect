const Boom = require('boom');
const { params } = require('./user-validation');

module.exports = {
  method: 'GET',
  path: '/users/{user}',
  config: {
    validate: {
      params,
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const userPromise = User
      .findOne({ _id: req.params.user })
      .exec()
      .then((user) => {
        if (!user) {
          return Boom.notFound('User Not Found');
        }
        return user;
      });

    res(userPromise);
  },
};
