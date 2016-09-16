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
            password: req.payload.plainPassword, // todo: we should encrypt the password or hash it
          })
          .save();
      });

    res.mongodb(userPromise, ['password']);
  },
};
