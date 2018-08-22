const { payload } = require('../appValidations');
const { permissions } = require('@lvconnect/config/server');

const { hasRoleInList, hasScopeInList } = require('../../middlewares');

module.exports = {
  method: 'POST',
  path: '/apps',
  config: {
    pre: [hasScopeInList('users:create'), hasRoleInList(permissions.addApp)],
    validate: {
      payload,
    },
  },
  async handler(req, res) {
    const { Application } = req.server.plugins.apps.models;

    const app = await Application.create(req.payload);

    res(app);
  },
};
