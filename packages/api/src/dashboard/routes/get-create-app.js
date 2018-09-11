module.exports = {
  method: 'GET',
  path: '/dashboard/apps/create',
  config: { auth: 'session' },
  async handler(req, res) {
    return res.view('create-app', {
      pageTitle: 'Create application',
      user: req.auth.credentials,
      validScopes: req.server.plugins.oauth.validScopes,
    });
  },
};
