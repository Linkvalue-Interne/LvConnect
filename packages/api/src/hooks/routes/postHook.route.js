const Joi = require('@hapi/joi');
const { permissions } = require('@lvconnect/config/server');

const { payload } = require('../hookValidations');
const { hasRoleInList, hasScopeInList } = require('../../middlewares');

module.exports = {
  path: '/hooks',
  method: 'POST',
  config: {
    pre: [hasScopeInList(['hooks:create']), hasRoleInList(permissions.addHook)],
    validate: {
      payload: { ...payload, appId: Joi.string().required() },
    },
  },
  async handler(req, res) {
    const { Hook } = req.server.plugins.hooks.models;
    const hook = Hook.create(req.payload);
    return res.mongodb(hook, ['secret']);
  },
};
