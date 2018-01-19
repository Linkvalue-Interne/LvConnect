const displayPermissions = require('./display-permissions');
const getFormUrl = require('./get-form-url');

module.exports = function login(req, res) {
  const { User } = req.server.plugins.users.models;
  const url = getFormUrl(req);

  return User.findOneByEmailAndPassword(req.payload.email, req.payload.password)
    .then((user) => {
      if (!user) {
        return res.view('oauth-login', {
          pageTitle: 'Login',
          email: req.payload.email,
          error: 'Invalid username or password.',
          url,
        });
      }

      return req.server.plugins.login.loginUser(req, user)
        .then(() => displayPermissions(req, res, user));
    })
    .catch((e) => {
      req.server.log('error', e);
      res.view('oauth-login', {
        pageTitle: 'Login',
        email: req.payload.email,
        error: 'An error occurred during login.',
        url,
      });
    });
};
