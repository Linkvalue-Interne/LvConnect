module.exports = {
  method: 'GET',
  path: '/logout',
  config: {
    auth: 'session',
  },
  handler(req, res) {
    req.server.plugins.login.destroySession(req.auth.artifacts.sid);
    req.cookieAuth.clear();
    return res.redirect('/login');
  },
};
