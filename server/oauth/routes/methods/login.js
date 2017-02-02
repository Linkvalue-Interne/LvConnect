const uuid = require('uuid/v4');
const displayPermissions = require('./display-permissions');

module.exports = function login(req, res) {
  const { User } = req.server.plugins.users.models;

  return User.findOneByEmailAndPassword(req.payload.email, req.payload.password)
    .then((user) => {
      const sid = uuid.v4();

      req.server.app.cache.set(sid, { user }, 0, (err) => {
        if (err) {
          throw err;
        }

        req.cookieAuth.set({ sid });

        displayPermissions(req, res, user);
      });
    })
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
