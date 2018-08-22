const Joi = require('joi');

module.exports = {
  method: 'POST',
  path: '/old/login',
  config: {
    auth: false,
    validate: {
      payload: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    return User.findOneByEmailAndPassword(req.payload.email, req.payload.password)
      .then((user) => {
        if (user.leftAt < new Date()) {
          return res.view('get-login', {
            email: req.payload.email,
            error: 'Account disabled.',
          }).code(401);
        }

        return req.server.plugins.login.loginUser(req, user)
          .then(() => res.redirect(req.query.redirect || '/old/dashboard'));
      })
      .catch(() => {
        res.view('get-login', {
          email: req.payload.email,
          error: 'Invalid username or password.',
        }).code(401);
      });
  },
};
