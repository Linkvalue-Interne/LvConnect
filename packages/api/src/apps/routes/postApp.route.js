const { payload } = require('../appValidations');
const { permissions } = require('@lvconnect/config/server');

const { hasRoleInList, hasScopeInList } = require('../../middlewares');

module.exports = {
  method: 'POST',
  path: '/apps',
  config: {
    pre: [hasScopeInList(['apps:create']), hasRoleInList(permissions.addApp)],
    validate: {
      payload,
    },
  },
  async handler(req, res) {
    const { Application } = req.server.plugins.apps.models;
    const app = Application.create({ ...req.payload, user: req.auth.credentials.user._id });
    return res.mongodb(app);
  },
};
