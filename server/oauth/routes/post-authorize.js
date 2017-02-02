const Joi = require('joi');
const login = require('./methods/login');
const authorize = require('./methods/authorize');

module.exports = {
  method: 'POST',
  path: '/oauth/authorize',
  config: {
    auth: {
      mode: 'optional',
      strategies: ['session'],
    },
    plugins: { 'hapi-auth-cookie': { redirectTo: false } },
    validate: {
      payload: Joi.object({
        step: Joi.string().valid('login', 'permissions').required(),
        email: Joi.alternatives().when('step', {
          is: 'login',
          then: Joi.string().required(),
          otherwise: Joi.any().forbidden(),
        }),
        password: Joi.alternatives().when('step', {
          is: 'login',
          then: Joi.string().required(),
          otherwise: Joi.any().forbidden(),
        }),
        scopes: Joi.alternatives().when('step', {
          is: 'permissions',
          then: Joi.string().required(),
          otherwise: Joi.any().forbidden(),
        }),
      }),
      query: Joi.object().keys({
        app_id: Joi.string().required(),
        redirect_uri: Joi.string().required(),
      }),
    },
  },
  handler(req, res) {
    if (req.payload.step === 'login') {
      return login(req, res);
    }

    if (!req.auth.isAuthenticated) {
      return res.view('oauth-login', {
        pageTitle: 'Login',
        appId: req.query.app_id,
        redirectUri: req.query.redirect_uri,
      });
    }

    return authorize(req, res);
  },
};
