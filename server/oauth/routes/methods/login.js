const displayPermissions = require('./display-permissions');

module.exports = function login(req, res) {
  const { User } = req.server.plugins.users.models;

  return User.findOneByEmailAndPassword(req.payload.email, req.payload.password)
    .then(user => req.server.plugins.login.loginUser(req, user))
    .then(user => displayPermissions(req, res, user))
    .catch(() => {
      res.view('oauth-login', {
        pageTitle: 'Login',
        email: req.payload.email,
        appId: req.query.app_id,
        redirectUri: req.query.redirect_uri,
        error: 'Invalid username or password.',
      });
    });
};
