const Joi = require('joi');
const login = require('./methods/login');
const authorize = require('./methods/authorize');

module.exports = {
  method: 'POST',
  path: '/oauth/authorize',
  config: {
    auth: 'session',
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

    return authorize(req, res);
  },
};
