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
        allowedScopes: Joi.array().items(Joi.string()),
        redirectUri: Joi.string().uri().required(),
      }),
      failAction: (req, res, src, error) => {
        req.server.log('info', src);
        req.server.log('info', error);
        const { Application } = req.server.plugins.oauth.models;

        /* TODO: handle form errors */
        Application.findOne({ _id: req.params.id })
          .then((app) => {
            res.view('create-app', {
              pageTitle: 'Edit app',
              app,
              errors: error,
              editMode: true,
              validScopes: req.server.plugins.oauth.validScopes,
            });
          });
      },
    },
  },
  handler(req, res) {
    const { Application } = req.server.plugins.oauth.models;

    Application.findOne({ _id: req.params.id })
      .then(app => Object.assign(app, {
        name: req.payload.name,
        description: req.payload.description,
        allowedScopes: req.payload.allowedScopes,
        redirectUris: [req.payload.redirectUri],
      }).save().catch(() => res.view('create-app', {
        pageTitle: 'Edit app',
        user: req.auth.credentials,
        app,
        editMode: true,
        validScopes: req.server.plugins.oauth.validScopes,
      })))
      .then(() => res.redirect('/dashboard/apps'))
      .catch(() => res.view('get-apps', {
        pageTitle: 'Applications',
        user: req.auth.credentials,
      }));
  },
};
