const Joi = require('joi');
const { Types } = require('mongoose');

exports.payload = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().min(2).max(255).required(),
  allowedScopes: Joi.array().items(Joi.string()).single(),
  redirectUris: Joi.array().items(Joi.string().uri()).required(),
});

exports.params = (value, options, next) => {
  next(Types.ObjectId.isValid(value.app) ? null : new Error('Invalid App Id'), value);
};
