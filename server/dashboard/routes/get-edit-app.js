module.exports = {
  method: 'GET',
  path: '/dashboard/apps/edit/{id}',
  config: { auth: 'session' },
  handler(req, res) {
    const { Application } = req.server.plugins.oauth.models;

    Application.findOne({ _id: req.params.id })
      .then(app => res.view('create-app', {
        user: req.auth.credentials,
        app,
      }));
  },
};
