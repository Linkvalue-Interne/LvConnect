const displayPermissions = require('./display-permissions');

module.exports = function changePassword(req, res) {
  if (req.payload.plainPassword !== req.payload.plainPasswordCheck) {
    return res.view('oauth-change-password', {
      pageTitle: 'Password change',
      error: 'Passwords don\'t match',
    }).code(401);
  }

  const user = req.auth.credentials;

  return user.comparePassword(req.payload.plainPassword)
    .then((isSamePassword) => {
      if (isSamePassword) {
        return res.view('oauth-change-password', {
          pageTitle: 'Password change',
          error: 'You must choose a password different from the previous one',
          appId: req.query.app_id,
          redirectUri: req.query.redirect_uri,
        }).code(401);
      }

      return user.hashPassword(req.payload.plainPassword)
        .then(() => {
          user.needPasswordChange = false;
          return user.save();
        })
        .then(() => displayPermissions(req, res, user));
    })
    .catch(() => res.view('oauth-change-password', {
      pageTitle: 'Password change',
      error: 'An unknown error occurred',
      appId: req.query.app_id,
      redirectUri: req.query.redirect_uri,
    }).code(401));
};
