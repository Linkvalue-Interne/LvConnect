const Joi = require('joi');
const Boom = require('boom');

const login = require('./methods/login');
const authorize = require('./methods/authorize');
const changePassword = require('./methods/change-password');
const getFormUrl = require('./methods/get-form-url');

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
        app_id: Joi.string(),
        client_id: Joi.string(),
        redirect_uri: Joi.string().required(),
        response_type: Joi.string().valid(['code', 'token']),
        state: Joi.string().max(255),
        scope: Joi.string(),
      }),
    },
  },
  handler(req, res) {
    if (!req.query.app_id && !req.query.client_id) {
      return res(Boom.badRequest('You must specify either app_id or client_id query param.'));
    }

    if (req.payload.step === 'login') {
      return login(req, res);
    }

    if (req.payload.step === 'change-password') {
      return changePassword(req, res);
    }

    if (!req.auth.isAuthenticated) {
      return res.view('oauth-login', {
        pageTitle: 'Login',
        url: getFormUrl(req),
      });
    }

    return authorize(req, res);
  },
};
