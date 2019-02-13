const Joi = require('joi');
const { Types } = require('mongoose');
const { hooks } = require('@lvconnect/config/server');

exports.payload = {
  name: Joi.string().required(),
  uri: Joi.string().required(),
  secret: Joi.string().required(),
  listeningTo: Joi.array().items(Joi.string().valid(Object.values(hooks.events))).min(1).required(),
  active: Joi.boolean(),
};

exports.params = (value) => {
  if (!Types.ObjectId.isValid(value.hook)) {
    throw new Error('Invalid Hook Id');
  }
  return value;
};
