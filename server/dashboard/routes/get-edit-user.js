const { hasRoleInList } = require('../middlewares');
const { validRoles } = require('../../users/routes/user-validation');

module.exports = {
  method: 'GET',
  path: '/dashboard/users/{user}/edit',
  config: {
    pre: [hasRoleInList(['rh', 'staff'])],
    auth: 'session',
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    User
      .findOne({ _id: req.params.user })
      .exec()
      .then((user) => {
        if (!user) return res.view('404');
        return res.view('edit-user', {
          userData: user,
          validRoles,
        });
      })
      .catch(res);
  },
};
