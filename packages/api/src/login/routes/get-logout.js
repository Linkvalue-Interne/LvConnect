module.exports = {
  method: 'GET',
  path: '/logout',
  config: {
    auth: 'session',
  },
  async handler(req, res) {
    await req.server.plugins.login.logoutUser(req);
    return res.redirect(req.query.redirect ? decodeURI(req.query.redirect) : '/login');
  },
};
