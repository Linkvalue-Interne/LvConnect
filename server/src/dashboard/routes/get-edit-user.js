const { hasRoleInList } = require('../middlewares');
const { validRoles, validCities } = require('../../users/routes/user-validation');
const { BOARD, HR } = require('../../roles');

module.exports = {
  method: 'GET',
  path: '/dashboard/users/{user}/edit',
  config: {
    pre: [hasRoleInList([BOARD, HR])],
    auth: 'session',
  },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    User
      .findOne({ _id: req.params.user })
      .exec()
      .then((user) => {
        if (!user) return res.view('404');
        return res.view('create-user', {
          pageTitle: 'Edit partner',
          userData: user,
          validRoles,
          validCities,
          editMode: true,
        });
      })
      .catch(res);
  },
};
