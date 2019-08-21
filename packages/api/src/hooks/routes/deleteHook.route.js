const Boom = require('@hapi/boom');
const { permissions } = require('@lvconnect/config/server');

const { hasRoleInList, hasScopeInList } = require('../../middlewares');
const { params } = require('../hookValidations');

module.exports = {
  method: 'DELETE',
  path: '/hooks/{hook}',
  config: {
    pre: [hasScopeInList(['hooks:delete']), hasRoleInList(permissions.deleteHook)],
    validate: {
      params,
    },
  },
  async handler(req) {
    const { Hook } = req.server.plugins.hooks.models;

    const { n: deleted } = await Hook.remove({ _id: req.params.hook });

    if (!deleted) {
      throw Boom.notFound();
    }

    return { deleted: true };
  },
};
