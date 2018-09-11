const { validRoles, validCities } = require('../../users/routes/user-validation');

module.exports = {
  method: 'GET',
  path: '/dashboard/users/create',
  config: { auth: 'session' },
  async handler(req, res) {
    return res.view('create-user', {
      pageTitle: 'Add new partner',
      user: req.auth.credentials,
      newUser: {},
      validRoles,
      validCities,
    });
  },
};
