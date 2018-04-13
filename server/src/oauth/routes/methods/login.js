const displayPermissions = require('./display-permissions');
const getFormUrl = require('./get-form-url');

module.exports = function login(req, res) {
  const { User } = req.server.plugins.users.models;
  const url = getFormUrl(req);

  return User.findOneByEmailAndPassword(req.payload.email, req.payload.password)
    .then(user => req.server.plugins.login.loginUser(req, user)
      .then(() => {
        if (user.needPasswordChange) {
          return res.view('oauth-change-password', {
            pageTitle: 'Change password',
            url,
          });
        }

        return displayPermissions(req, res, user);
      }))
    .catch((e) => {
      if (e.message === 'user_not_found' || e.message === 'invalid_password') {
        return res.view('oauth-login', {
          pageTitle: 'Login',
          email: req.payload.email,
          error: 'Invalid username or password.',
          url,
        }).code(401);
      }

      req.server.log('error', e);
      return res.view('oauth-login', {
        pageTitle: 'Login',
        email: req.payload.email,
        error: 'An error occurred during login.',
        url,
      }).code(500);
    });
};
