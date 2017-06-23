const Joi = require('joi');
const crypto = require('crypto');

module.exports = {
  method: 'POST',
  path: '/dashboard/change-password',
  config: {
    auth: { strategies: ['pkey-token', 'query-token', 'session'] },
    validate: {
      payload: {
        plainPassword: Joi.string().min(6).required(),
        plainPasswordCheck: Joi.string().required(),
        logoutAllDevices: Joi.string(),
      },
    },
  },
  handler(req, res) {
    const { logoutAllDevices, plainPassword, plainPasswordCheck } = req.payload;
    if (plainPassword !== plainPasswordCheck) {
      return res.view('change-password', {
        pageTitle: 'Password change',
        error: 'Passwords don\'t match',
      }).code(401);
    }

    const user = req.auth.credentials;

    return user.comparePassword(plainPassword)
      .then((isSamePassword) => {
        if (isSamePassword) {
          return res.view('change-password', {
            pageTitle: 'Password change',
            error: 'You must choose a password different from the previous one',
          }).code(401);
        }

        return user.hashPassword(plainPassword)
          .then(() => {
            user.needPasswordChange = false;
            return user.save();
          })
          .then(() => {
            if (req.auth.artifacts && req.auth.artifacts.pkey) {
              const hashedToken = crypto.createHmac('sha512', 'hello').update(req.auth.artifacts.pkey).digest('hex');
              return new Promise((resolve, reject) => req.server.app.passwordResetCache.drop(hashedToken, err =>
                (err ? reject(err) : resolve())));
            }

            return Promise.resolve();
          })
          .then(() => (logoutAllDevices ? req.server.plugins.oauth.cleanupUserTokens(user._id) : null))
          .then(() => (logoutAllDevices ? req.server.plugins.login.cleanupUserSessions(user._id.toString()) : null))
          .then(() => req.server.plugins.login.loginUser(req, user))
          .then(() => res.redirect(req.query.redirect_uri || '/dashboard'));
      })
      .catch((err) => {
        req.server.log('error', err);
        res.view('change-password', {
          pageTitle: 'Password change',
          error: 'An unknown error occurred',
        }).code(401);
      });
  },
};
