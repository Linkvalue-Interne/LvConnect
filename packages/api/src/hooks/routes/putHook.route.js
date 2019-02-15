const Boom = require('boom');
const { permissions } = require('@lvconnect/config/server');
const { payload, params } = require('../hookValidations');

const { hasRoleInList, hasScopeInList } = require('../../middlewares');

module.exports = {
  method: 'PUT',
  path: '/hooks/{hook}',
  config: {
    pre: [
      hasScopeInList(['hooks:modify']),
      hasRoleInList(permissions.editHook),
    ],
    validate: {
      payload,
      params,
    },
  },
  async handler(req, res) {
    const { Hook } = req.server.plugins.hooks.models;

    const hook = await Hook.findOneAndUpdate(
      { _id: req.params.hook },
      { $set: req.payload },
      { new: true, runSettersOnQuery: true },
    );

    if (!hook) {
      throw Boom.notFound('Hook not found');
    }

    return res.mongodb(hook, ['secret']);
  },
};
