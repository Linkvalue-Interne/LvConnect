const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/dashboard/apps/edit/{id}',
    config: {
      auth: 'session',
      validate: {
        payload: Joi.object({
          name: Joi.string().min(2).max(255).required(),
          description: Joi.string().min(2).max(255).required(),
        }),
        failAction: (req, res, src, error) => {
          req.server.log('info', src);
          req.server.log('info', error);
          const { Application } = req.server.plugins.oauth.models;

          /* TODO: handle form errors */
          Application.findOne({_id:req.params.id})
            .then((app) => {
              res.view('create-app', {
                user: req.auth.credentials,
                app:app,
                errors: error,
              })
            });
        },
      },
    },
    handler(req, res) {
      const { Application } = req.server.plugins.oauth.models;

      Application.findOne({_id:req.params.id})
        .then((app) => {
          app.name = req.payload.name;
          app.description = req.payload.description;
          app.save();
        })
        .then(() => {
          res.redirect('/dashboard/apps');
        }) .catch(() => {
        res.view('get-apps', {
          user: req.auth.credentials,
        });
      });
    },
};
