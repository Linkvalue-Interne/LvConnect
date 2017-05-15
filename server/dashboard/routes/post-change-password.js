const Joi = require('joi');

module.exports = {
  method: 'POST',
  path: '/dashboard/change-password',
  config: {
    auth: { strategies: ['query-token', 'session'] },
    validate: {
      payload: {
        plainPassword: Joi.string().min(6).required(),
        plainPasswordCheck: Joi.string().required(),
      },
    },
  },
  handler(req, res) {
    if (req.payload.plainPassword !== req.payload.plainPasswordCheck) {
      return res.view('change-password', {
        pageTitle: 'Password change',
        error: 'Passwords don\'t match',
      }).code(401);
    }

    const user = req.auth.credentials;

    return user.comparePassword(req.payload.plainPassword)
      .then((isSamePassword) => {
        if (isSamePassword) {
          return res.view('change-password', {
            pageTitle: 'Password change',
            error: 'You must choose a password different from the previous one',
          }).code(401);
        }

        return user.hashPassword(req.payload.plainPassword)
          .then(() => {
            user.needPasswordChange = false;
            return user.save();
          })
          .then(() => req.server.plugins.oauth.cleanupUserTokens(user._id))
          .then(() => res.redirect(req.query.redirect_uri || '/dashboard'));
      })
      .catch((err) => {
        console.error('error', err);
        res.view('change-password', {
          pageTitle: 'Password change',
          error: 'An unknown error occurred',
        }).code(401);
      });
  },
};
