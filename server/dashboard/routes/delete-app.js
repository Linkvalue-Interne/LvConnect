module.exports = {
  method: 'GET',
  path: '/dashboard/apps/delete/{id}',
  config: { auth: 'session' },
  handler(req, res) {

    const { Application } = req.server.plugins.oauth.models;

    Application.findOne({_id:req.params.id})
      .remove()
      .then(() => {
        Application
          .find()
          .select('-appSecret')
          .sort('appId')
          .then((apps) => {
            res.view('get-apps', {
              user: req.auth.credentials,
              apps,
            });
          });
      });
  },
};
