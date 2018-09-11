const { roles } = require('@lvconnect/config/server');

module.exports = {
  method: 'GET',
  path: '/dashboard/users',
  config: { auth: 'session' },
  async handler(req, res) {
    const { User } = req.server.plugins.users.models;

    const users = await User.find().sort('lastName firstName');
    return res.view('get-users', {
      pageTitle: 'Partners list',
      users,
      adminRoles: [roles.HR, roles.BOARD],
    });
  },
};
