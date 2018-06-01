const { hasRoleInList } = require('../middlewares');
const { BOARD, HR } = require('../../roles');

module.exports = {
  method: 'GET',
  path: '/dashboard/users/{id}/delete',
  config: {
    pre: [hasRoleInList([BOARD, HR])],
    auth: 'session',
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    return User.remove({ _id: req.params.id })
      .then(() => req.server.methods.cleanupUserAuth(req.params.id))
      .then(() => res.redirect('/dashboard/users'));
  },
};
