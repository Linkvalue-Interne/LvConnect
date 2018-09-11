const Boom = require('boom');
const { permissions } = require('@lvconnect/config/server');

const { hasRoleInList, hasScopeInList } = require('../../middlewares');
const { params } = require('../appValidations');

module.exports = {
  method: 'DELETE',
  path: '/apps/{app}',
  config: {
    pre: [hasScopeInList('apps:delete'), hasRoleInList(permissions.deleteApp)],
    validate: {
      params,
    },
  },
  async handler(req) {
    const { Application } = req.server.plugins.apps.models;

    const { n: deleted } = await Application.remove({ _id: req.params.app });

    if (!deleted) {
      throw Boom.notFound();
    }

    return { deleted: true };
  },
};
