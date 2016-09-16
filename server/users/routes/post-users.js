const { payload } = require('./user-validation');

module.exports = {
  method: 'POST',
  path: '/users',
  config: {
    validate: {
      payload,
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    const user = new User({
      firstName: req.payload.firstName,
      lastName: req.payload.lastName,
      email: req.payload.email,
      password: req.payload.plainPassword, // todo: we should encrypt the password or hash it
    });

    res.mongodb(user.save(), ['password']);
  },
};
