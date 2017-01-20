const { validRoles } = require('../../users/routes/user-validation');

module.exports = {
  method: 'GET',
  path: '/dashboard/users/create',
  config: { auth: 'session' },
  handler(req, res) {
    res.view('create-user', {
      user: req.auth.credentials,
      newUser: {},
      validRoles,
    });
  },
};
