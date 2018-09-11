const Boom = require('boom');
const Joi = require('joi');

const displayPermissions = require('./methods/display-permissions');
const getFormUrl = require('./methods/get-form-url');

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
        response_type: Joi.string().valid(['code', 'token']),
        state: Joi.string().max(255),
        scope: Joi.string(),
      }),
    },
  },
  async handler(req, res) {
    if (!req.query.app_id && !req.query.client_id) {
      throw Boom.badRequest('You must specify either app_id or client_id query param.');
    }

    const url = getFormUrl(req);

    if (!req.auth.isAuthenticated) {
      return res.view('oauth-login', {
        pageTitle: 'Login',
        url,
      });
    }

    if (req.auth.credentials.needPasswordChange) {
      return res.view('oauth-change-password', {
        pageTitle: 'Change password',
        url,
      });
    }

    return displayPermissions(req, res);
  },
};
