const { payload } = require('./user-validation');

module.exports = {
  method: 'POST',
  path: '/users',
  config: {
    validate: {
      payload: payload.post,
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const { createOVHAccount } = req.server.plugins.tasks;

    const user = new User({
      firstName: req.payload.firstName,
      lastName: req.payload.lastName,
      email: req.payload.email,
      fallbackEmail: req.payload.fallbackEmail,
    });

    res.mongodb(user
      .hashPassword(req.payload.plainPassword)
      .then(() => user.save())
      .then((savedUser) => {
        createOVHAccount({
          user: savedUser,
          email: user.email,
          plainPassword: req.payload.plainPassword,
        }).save();
        return savedUser;
      }), ['password']);
  },
};
