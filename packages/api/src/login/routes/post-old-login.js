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
  async handler(req, res) {
    const { User } = req.server.plugins.users.models;

    try {
      const user = await User.findOneByEmailAndPassword(req.payload.email, req.payload.password);
      if (user.leftAt < new Date()) {
        return res.view('get-login', {
          email: req.payload.email,
          error: 'Account disabled.',
        }).code(401);
      }

      await req.server.plugins.login.loginUser(req, user);
      return res.redirect(req.query.redirect || '/old/dashboard');
    } catch (e) {
      return res.view('get-login', {
        email: req.payload.email,
        error: 'Invalid username or password.',
      }).code(401);
    }
  },
};
