module.exports = {
  method: 'GET',
  path: '/dashboard/apps',
  config: { auth: 'session' },
  handler(req, res) {
    const { Application } = req.server.plugins.apps.models;

    Application
      .find()
      .select('-appSecret')
      .then((apps) => {
        res.view('get-apps', {
          pageTitle: 'Applications',
          apps,
        });
      });
  },
};
