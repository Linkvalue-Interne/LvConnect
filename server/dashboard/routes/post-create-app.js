const Joi = require('joi');

module.exports = {
  method: 'POST',
  path: '/dashboard/apps/create',
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
        res.view('create-application', {
          user: req.auth.credentials,
          errors: error,
        });
      },
    },
  },
  handler(req, res) {
    const { Application } = req.server.plugins.oauth.models;

    const app = new Application({
      name: req.payload.name,
      description: req.payload.description,
    });

    app.save()
      .then(() => {
        res.redirect('/dashboard/apps');
      })
      .catch(() => {
        res.view('create-app', {
          user: req.auth.credentials,
        });
      });
  },
};
