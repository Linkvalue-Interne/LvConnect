module.exports = {
  method: 'GET',
  path: '/dashboard/apps',
  config: { auth: 'session' },
  async handler(req, res) {
    const { Application } = req.server.plugins.apps.models;

    const apps = await Application.find().sort([['name', 1]]);

    return res.view('get-apps', {
      pageTitle: 'Applications',
      apps,
    });
  },
};
