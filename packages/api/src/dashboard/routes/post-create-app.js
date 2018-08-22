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
        allowedScopes: Joi.array().items(Joi.string()).single(),
        redirectUris: Joi.string().required(),
      }),
      failAction: (req, res, src, error) => {
        res.view('create-app', {
          pageTitle: 'Create application',
          user: req.auth.credentials,
          errors: error,
          validScopes: req.server.plugins.oauth.validScopes,
        });
      },
    },
  },
  handler(req, res) {
    const { Application } = req.server.plugins.apps.models;

    const app = new Application({
      name: req.payload.name,
      description: req.payload.description,
      allowedScopes: req.payload.allowedScopes,
      redirectUris: req.payload.redirectUris.split(/\r?\n/),
    });

    app.save()
      .then(() => {
        res.redirect('/old/dashboard/apps');
      })
      .catch(() => {
        res.view('create-app', {
          pageTitle: 'Create application',
          user: req.auth.credentials,
          validScopes: req.server.plugins.oauth.validScopes,
          splitRedirectUris: app.redirectUris.join('\n'),
        });
      });
  },
};
