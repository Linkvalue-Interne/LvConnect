const { roles } = require('@lvconnect/config/server');

const { hasRoleInList } = require('../middlewares');
const { validRoles, validCities } = require('../../users/routes/user-validation');

module.exports = {
  method: 'GET',
  path: '/dashboard/users/{user}/edit',
  config: {
    pre: [hasRoleInList([roles.BOARD, roles.HR])],
    auth: 'session',
  },
  async handler(req, res) {
    const { User } = req.server.plugins.users.models;

    const user = await User.findOne({ _id: req.params.user });
    if (!user) return res.view('404');
    return res.view('create-user', {
      pageTitle: 'Edit partner',
      userData: user,
      validRoles,
      validCities,
      editMode: true,
    });
  },
};
