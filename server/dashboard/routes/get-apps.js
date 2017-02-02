module.exports = {
  method: 'GET',
  path: '/dashboard/apps',
  config: { auth: 'session' },
  handler(req, res) {
    const { Application } = req.server.plugins.oauth.models;

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
