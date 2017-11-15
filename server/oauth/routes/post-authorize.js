const Joi = require('joi');

const login = require('./methods/login');
const authorize = require('./methods/authorize');
const changePassword = require('./methods/change-password');
const validScopes = require('../scopes');

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
        step: Joi.string().valid('login', 'permissions', 'change-password').required(),
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
        plainPassword: Joi.alternatives().when('step', {
          is: 'change-password',
          then: Joi.string().required().min(6),
          otherwise: Joi.any().forbidden(),
        }),
        plainPasswordCheck: Joi.alternatives().when('step', {
          is: 'change-password',
          then: Joi.string().required().min(6),
          otherwise: Joi.any().forbidden(),
        }),
      }),
      query: Joi.object().keys({
        app_id: Joi.string().required(),
        redirect_uri: Joi.string().required(),
        response_type: Joi.string().valid(['code']),
        state: Joi.string().max(255),
        scope: Joi.array().items(Joi.string().valid(validScopes)).single(),
      }),
    },
  },
  handler(req, res) {
    if (req.payload.step === 'login') {
      return login(req, res);
    }

    if (req.payload.step === 'change-password') {
      return changePassword(req, res);
    }

    if (!req.auth.isAuthenticated) {
      return res.view('oauth-login', {
        pageTitle: 'Login',
        appId: req.query.app_id,
        redirectUri: req.query.redirect_uri,
        state: req.query.state,
      });
    }

    return authorize(req, res);
  },
};
