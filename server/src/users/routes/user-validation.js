const Joi = require('joi');
const { Types } = require('mongoose');
const { isValidNumber } = require('libphonenumber-js');

const validRoles = [
  'tech',
  'business',
  'hr',
  'board',
  'com',
  'finance',
];

const validCities = [
  'Lyon',
  'Lille',
  'Paris',
];

exports.validRoles = validRoles;
exports.validCities = validCities;

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


exports.payload = {
  post: Joi.object().keys({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    plainPassword: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    description: Joi.string().max(255),
    roles: Joi.array().items(Joi.string().valid(validRoles)).min(1).required(),
    githubHandle: Joi.string(),
    trelloHandle: Joi.string(),
    city: Joi.string().valid(validCities).required(),
    phone: customJoi.string().phone(),
    job: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    profilePictureUrl: Joi.string().uri().allow(null),
  }),
  put: Joi.object().keys({
    firstName: Joi.string().min(2),
    lastName: Joi.string().min(2),
    description: Joi.string().max(255),
    roles: Joi.array().items(Joi.string().valid(validRoles)).min(1),
    githubHandle: Joi.string(),
    trelloHandle: Joi.string(),
    city: Joi.string().valid(validCities),
    phone: customJoi.string().phone(),
    job: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    profilePictureUrl: Joi.string().uri().allow(null),
  }),
};

exports.params = (value, options, next) => {
  next(Types.ObjectId.isValid(value.user) ? null : new Error('Invalid User Id'), value);
};

exports.validRoles = validRoles;
