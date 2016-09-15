const Joi = require('joi');
const { Types } = require('mongoose');

exports.payload = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  plainPassword: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});

exports.params = (value, options, next) => {
  next(Types.ObjectId.isValid(value.user) ? null : new Error('Invalid User Id'), value);
};
