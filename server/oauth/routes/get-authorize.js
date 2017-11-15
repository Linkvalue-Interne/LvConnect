const Boom = require('boom');
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
        app_id: Joi.string(),
        client_id: Joi.string(),
        redirect_uri: Joi.string().required(),
        response_type: Joi.string().valid(['code']),
        state: Joi.string().max(255),
        scope: Joi.string(),
      }),
    },
  },
  handler(req, res) {
    if (!req.query.app_id && !req.query.client_id) {
      return res(Boom.badRequest('You must specify either app_id or client_id query param.'));
    }

    if (!req.auth.isAuthenticated) {
      return res.view('oauth-login', {
        pageTitle: 'Login',
        appId: req.query.app_id || req.query.client_id,
        redirectUri: req.query.redirect_uri,
        state: req.query.state,
        scope: req.query.scope,
      });
    }

    if (req.auth.credentials.needPasswordChange) {
      return res.view('oauth-change-password', {
        pageTitle: 'Change password',
        appId: req.query.app_id || req.query.client_id,
        redirectUri: req.query.redirect_uri,
        state: req.query.state,
        scope: req.query.scope,
      });
    }

    return displayPermissions(req, res);
  },
};
