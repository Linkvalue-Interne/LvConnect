const Boom = require('boom');
const { permissions } = require('@lvconnect/config/server');

const { hasRoleInList, hasScopeInList } = require('../../middlewares');
const { payload, params } = require('../appValidations');

module.exports = {
  method: 'PUT',
  path: '/apps/{app}',
  config: {
    pre: [
      hasScopeInList('apps:modify'),
      hasRoleInList(permissions.editApp),
    ],
    validate: {
      payload,
      params,
    },
  },
  async handler(req, res) {
    const { Application } = req.server.plugins.apps.models;

    const app = await Application.findOneAndUpdate(
      { _id: req.params.app },
      { $set: req.payload },
      { new: true, runSettersOnQuery: true },
    );

    if (!app) {
      return res(Boom.notFound('Application not found'));
    }

    return res.mongodb(app, ['appId', 'appSecret']);
  },
};
