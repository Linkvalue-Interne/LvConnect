const Joi = require('joi');
const { Types } = require('mongoose');

const validRoles = [
  'tech',
  'business',
  'hr',
  'staff',
  'board',
];

exports.payload = {
  post: Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    plainPassword: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    fallbackEmail: Joi.string().email(),
    roles: Joi.array().items(Joi.string().valid(validRoles)).min(1).required(),
  }),
  put: Joi.object({
    firstName: Joi.string().min(2),
    lastName: Joi.string().min(2),
    fallbackEmail: Joi.string().email(),
    roles: Joi.array().items(Joi.string().valid(validRoles)).min(1),
  }),
};

exports.params = (value, options, next) => {
  next(Types.ObjectId.isValid(value.user) ? null : new Error('Invalid User Id'), value);
};
