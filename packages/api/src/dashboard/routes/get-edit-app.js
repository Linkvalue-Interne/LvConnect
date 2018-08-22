module.exports = {
  method: 'GET',
  path: '/dashboard/apps/edit/{id}',
  config: { auth: 'session' },
  handler(req, res) {
    const { Application } = req.server.plugins.apps.models;

    Application.findOne({ _id: req.params.id })
      .then(app => res.view('create-app', {
        pageTitle: 'Edit app',
        user: req.auth.credentials,
        app,
        editMode: true,
        validScopes: req.server.plugins.oauth.validScopes,
        splitRedirectUris: app.redirectUris.join('\n'),
      }));
  },
};
