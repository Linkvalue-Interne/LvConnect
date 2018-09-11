const Boom = require('boom');
const { permissions } = require('@lvconnect/config/server');

const { hasRoleInList, hasScopeInList } = require('../../middlewares');
const { params } = require('./user-validation');

module.exports = {
  method: 'DELETE',
  path: '/users/{user}',
  config: {
    pre: [hasScopeInList('users:delete'), hasRoleInList(permissions.deleteUser)],
    validate: {
      params,
    },
  },
  async handler(req) {
    const { User } = req.server.plugins.users.models;
    const { n: deleted } = await User.remove({ _id: req.params.user });

    if (!deleted) {
      throw Boom.notFound();
    }

    await req.server.methods.cleanupUserAuth(req.params.user);
    return { deleted: true };
  },
};
