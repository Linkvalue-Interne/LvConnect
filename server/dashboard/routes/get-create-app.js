module.exports = {
  method: 'GET',
  path: '/dashboard/apps/create',
  config: { auth: 'session' },
  handler(req, res) {
    res.view('create-app', {
      pageTitle: 'Create application',
      user: req.auth.credentials,
    });
  },
};
