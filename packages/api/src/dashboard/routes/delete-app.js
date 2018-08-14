module.exports = {
  method: 'GET',
  path: '/dashboard/apps/delete/{id}',
  config: { auth: 'session' },
  handler(req, res) {
    const { Application } = req.server.plugins.oauth.models;

    return Application.remove({ _id: req.params.id })
      .then(() => res.redirect('/old/dashboard/apps'));
  },
};
