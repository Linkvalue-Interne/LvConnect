const Joi = require('joi');

module.exports = {
  method: 'POST',
  path: '/forgot-password',
  config: {
    auth: false,
    validate: {
      payload: Joi.object({
        email: Joi.string().required(),
      }),
    },
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;
    const { email } = req.payload;

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          res.view('get-forgot-password', {
            title: 'Forgot password',
            email,
            error: 'Email doesn\'t match any account.',
          });
        }

        return req.server.plugins.login.resetPassword(user);
      })
      .then(() => {
        res.view('get-forgot-password', {
          title: 'Forgot password',
          success: true,
        });
      })
      .catch(() => {
        res.view('get-forgot-password', {
          title: 'Forgot password',
          email,
          error: 'An error occurred during password reset, sorry for the inconvenience.',
        });
      });
  },
};
