const { permissions } = require('@lvconnect/config/server');

const { hasRoleInList, hasScopeInList } = require('../middlewares');
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
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    const userPromise = User
      .remove({ _id: req.params.user })
      .exec()
      .then(() => req.server.methods.cleanupUserAuth(req.params.user))
      .then(() => ({ deleted: true }));

    res(userPromise);
  },
};
