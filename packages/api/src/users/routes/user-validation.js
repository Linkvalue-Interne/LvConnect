const Joi = require('joi');
const { Types } = require('mongoose');
const { roles, cities } = require('@lvconnect/config/server');
const { isValidNumber } = require('libphonenumber-js');

const validRoles = Object.values(roles);

exports.validRoles = validRoles;
exports.validCities = cities;

const customJoi = Joi.extend(joi => ({
  base: joi.string(),
  name: 'string',
  language: {
    phone: 'needs to be a proper french phone number',
  },
  rules: [
    {
      name: 'phone',
      validate(params, value, state, options) {
        if (!isValidNumber(value, 'FR')) {
          return this.createError('string.phone', { v: value }, state, options);
        }

        return value;
      },
    },
  ],
}));

const commonFields = {
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  roles: Joi.array().items(Joi.string().valid(validRoles)).min(1).required(),
  city: Joi.string().valid(cities).required(),
  description: Joi.string().max(255).empty('').allow(null),
  phone: customJoi.string().phone().allow(null),
  job: Joi.string().allow(null),
  tags: Joi.array().items(Joi.string()),
  hiredAt: Joi.date().iso().allow(null),
  leftAt: Joi.date().iso().allow(null),
  birthDate: Joi.date().iso().allow(null),
  registrationNumber: Joi.string().allow(null),
  address: Joi.object().keys({
    street: Joi.string(),
    zipCode: Joi.string(),
    city: Joi.string(),
  }).allow(null),
};

exports.payload = {
  post: Joi.object().keys({
    ...commonFields,
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    roles: Joi.array().items(Joi.string().valid(validRoles)).min(1).required(),
    city: Joi.string().valid(cities).required(),
    email: Joi.string().email().required(),
    githubHandle: Joi.string(),
    trelloHandle: Joi.string(),
  }),
  put: Joi.object().keys({
    ...commonFields,
    firstName: Joi.string().min(2),
    lastName: Joi.string().min(2),
    roles: Joi.array().items(Joi.string().valid(validRoles)).min(1),
    city: Joi.string().valid(cities),
  }),
};

exports.params = (value) => {
  if (!Types.ObjectId.isValid(value.user)) {
    throw new Error('Invalid App Id');
  }
  return value;
};

exports.validRoles = validRoles;
