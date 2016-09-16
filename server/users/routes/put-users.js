const Boom = require('boom');
const { payload, params } = require('./user-validation');

module.exports = {
  method: 'PUT',
  path: '/users/{user}',
  config: {
    validate: {
      payload,
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

        return Object
          .assign(user, {
            firstName: req.payload.firstName,
            lastName: req.payload.lastName,
            email: req.payload.email,
          })
          .hashPassword(req.payload.plainPassword)
          .then(() => user.save());
      });

    res.mongodb(userPromise, ['password']);
  },
};
