const _ = require('lodash');
const Boom = require('boom');

const mappings = {
  'users:get': {
    label: 'Read all partner information',
    icon: 'person',
    description: 'Allows the application to read all partners information without restrictions.',
  },
  'users:create': {
    label: 'Create a new partner',
    icon: 'person',
    description: 'Allows the application to create a new partner, ' +
    'triggering all services integrations (GitHub, Trello, etc).',
  },
  'users:delete': {
    label: 'Delete a partner',
    icon: 'person',
    description: 'The application will be able to delete any partner without restrictions.',
  },
  'users:modify': {
    label: 'Modify any partner information',
    icon: 'person',
    description: 'Allows the application to edit any partner information without restrictions.',
  },
  'profile:get': {
    label: 'See your personal information',
    icon: 'person',
    description: 'The application will have access to your personal information',
  },
  'profile:modify': {
    label: 'Modify your personal information',
    icon: 'person',
    description: 'The application will be able to edit your personal information',
  },
};

module.exports = function displayPermissions(req, res) {
  const { Authorization, Application } = req.server.plugins.oauth.models;
  const { redirect_uri: redirectUri, app_id: appId } = req.query;
  const { generateAuthorizationCode } = req.server.methods;
  const user = req.auth.credentials;

  return Application.findOne({ appId })
    .then((application) => {
      if (!application) {
        throw Boom.notFound('Application not found');
      }
      return application;
    })
    .then(application => Authorization.findOne({ user, application }).then(auth => [auth, application]))
    .then(([authorization, application]) => {
      if (!application.redirectUris.find(uri => req.query.redirect_uri === uri)) {
        return Promise.reject(Boom.badRequest('Invalid redirect URI.'));
      }

      let diffPermissions = [];
      const requestedScopes = req.query.scope ?
        _.intersection(application.allowedScopes, req.query.scope) : application.allowedScopes;
      if (authorization === null) {
        diffPermissions = requestedScopes;
      } else {
        diffPermissions = _.difference(requestedScopes, authorization.allowedScopes);
      }

      const permissionsToAllow = diffPermissions.map(perm => mappings[perm]);
      const permissionsAllowed = _.difference(requestedScopes, diffPermissions).map(perm => mappings[perm]);

      // Ask for missing permissions
      if (!authorization || diffPermissions.length > 0) {
        return res.view('oauth-perms', {
          pageTitle: application.name,
          appName: application.name,
          appId: req.query.app_id,
          redirectUri: req.query.redirect_uri,
          permissionsToAllow,
          permissionsAllowed,
          permissions: diffPermissions,
          state: req.query.state,
          scope: req.query.scope,
        });
      }

      // Redirect if all permissions are already granted
      const state = req.query.state ? `&state=${req.query.state}` : '';
      return generateAuthorizationCode(user, application, application.allowedScopes)
        .then(authorizationCode => res.redirect(`${redirectUri}?code=${authorizationCode.code}${state}`));
    })
    .catch(error => res(Boom.wrap(error)));
};
