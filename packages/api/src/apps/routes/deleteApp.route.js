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
    const { Hook } = req.server.plugins.hooks.models;
    const { Authorization, AuthorizationCode, AccessToken, RefreshToken } = req.server.plugins.oauth.models;

    const { n: deleted } = await Application.remove({ _id: req.params.app });

    if (!deleted) {
      throw Boom.notFound();
    }

    await Promise.all([
      Hook.remove({ appId: req.params.app }),
      Authorization.remove({ application: req.params.app }),
      AuthorizationCode.remove({ application: req.params.app }),
      AccessToken.remove({ application: req.params.app }),
      RefreshToken.remove({ application: req.params.app }),
    ]);

    return { deleted: true };
  },
};
