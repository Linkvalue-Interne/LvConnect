const Joi = require('joi');
const displayPermissions = require('./methods/display-permissions');

module.exports = {
  method: 'GET',
  path: '/oauth/authorize',
  config: {
    auth: {
      mode: 'optional',
      strategies: ['session'],
    },
    plugins: { 'hapi-auth-cookie': { redirectTo: false } },
    validate: {
      query: Joi.object().keys({
        app_id: Joi.string().required(),
        redirect_uri: Joi.string().required(),
      }),
    },
  },
  handler(req, res) {
    if (!req.auth.isAuthenticated) {
      return res.view('oauth-login', {
        pageTitle: 'Login',
        appId: req.query.app_id,
        redirectUri: req.query.redirect_uri,
      });
    }

    if (req.auth.credentials.needPasswordChange) {
      return res.view('oauth-change-password', {
        pageTitle: 'Change password',
        appId: req.query.app_id,
        redirectUri: req.query.redirect_uri,
      });
    }

    return displayPermissions(req, res);
  },
};
