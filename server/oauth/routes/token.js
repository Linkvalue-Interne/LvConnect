const Joi = require('joi');

const grantTypes = ['password', 'refresh_token', 'authorization_code'];

module.exports = {
  method: 'POST',
  path: '/oauth/token',
  config: {
    validate: {
      payload: Joi.object({
        grantType: Joi.string().valid(grantTypes).required(),
        username: Joi.alternatives().when('grantType', { is: 'password', then: Joi.string().required() }),
        password: Joi.alternatives().when('grantType', { is: 'password', then: Joi.string().required() }),
        refreshToken: Joi.alternatives().when('grantType', { is: 'refresh_token', then: Joi.string().required() }),
        code: Joi.alternatives().when('grantType', { is: 'authorization_code', then: Joi.string().required() }),
        redirectUri: Joi.alternatives().when('grantType', { is: 'authorization_code', then: Joi.string().required() }),
      }),
    },
  },
  handler(req, res) {
    res({});
  },
};
