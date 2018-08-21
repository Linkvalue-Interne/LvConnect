const { roles } = require('@lvconnect/config/server');

const { hasRoleInList } = require('../middlewares');

module.exports = {
  method: 'GET',
  path: '/dashboard/users/{id}/delete',
  config: {
    pre: [hasRoleInList([roles.BOARD, roles.HR])],
    auth: 'session',
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    return User.remove({ _id: req.params.id })
      .then(() => req.server.methods.cleanupUserAuth(req.params.id))
      .then(() => res.redirect('/old/dashboard/users'));
  },
};
