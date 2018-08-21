const { roles } = require('@lvconnect/config/server');

module.exports = {
  method: 'GET',
  path: '/dashboard/users/{user}',
  config: { auth: 'session' },
  handler(req, res) {
    const { User } = req.server.plugins.users.models;

    User
      .findOne({ _id: req.params.user })
      .exec()
      .then((user) => {
        if (!user) return res.view('404');
        return res.view('get-user', {
          pageTitle: `${user.firstName} ${user.lastName}`,
          userData: user,
          adminRoles: [roles.BOARD, roles.HR],
        });
      })
      .catch(res);
  },
};
