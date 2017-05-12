const { hasRoleInList } = require('../middlewares');

module.exports = {
  method: 'GET',
  path: '/dashboard/users/{id}/delete',
  config: {
    pre: [hasRoleInList(['rh', 'board'])],
    auth: 'session',
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    return User.remove({ _id: req.params.id })
      .then(() => res.redirect('/dashboard/users'));
  },
};
