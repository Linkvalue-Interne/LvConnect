const Joi = require('joi');
const Boom = require('boom');
const _ = require('lodash');
const { oauth: { scopes: validScopes } } = require('@lvconnect/config');

module.exports = {
  method: 'GET',
  path: '/oauth/permissions',
  config: {
    auth: 'bearer',
    plugins: {
      crumb: {
        restful: true,
      },
    },
    validate: {
      query: Joi.object().keys({
        app_id: Joi.string(),
        client_id: Joi.string(),
        redirect_uri: Joi.string().required(),
        response_type: Joi.string().valid(['code', 'token']),
        state: Joi.string().max(255),
        scope: Joi.string(),
      }),
    },
  },
  async handler(req) {
    if (!req.query.app_id && !req.query.client_id) {
      throw Boom.badRequest('You must specify either app_id or client_id query param.');
    }

    const { Authorization } = req.server.plugins.oauth.models;
    const { Application } = req.server.plugins.apps.models;
    const {
      redirect_uri: redirectUri,
      app_id: appId,
      client_id: clientId,
      response_type: responseType,
    } = req.query;
    const { generateAuthorizationCode, generateAccessToken } = req.server.methods;
    const { user } = req.auth.credentials;

    const application = await Application.findOne({ appId: appId || clientId });
    if (!application) {
      throw Boom.notFound('application_not_found');
    }

    const authorization = await Authorization.findOne({ user, application });
    if (!application.redirectUris.find(uri => req.query.redirect_uri === uri)) {
      throw Boom.badRequest('invalid_redirect_uri');
    }

    const queryScopes = req.query.scope ? req.query.scope.split(' ') : [];
    const invalidScope = queryScopes.find(scope => validScopes.indexOf(scope) === -1);
    if (invalidScope) {
      throw Boom.badRequest('invalid_scopes');
    }

    let diffPermissions = [];
    const requestedScopes = queryScopes.length > 0 ?
      _.intersection(application.allowedScopes, queryScopes) : application.allowedScopes;
    if (authorization === null) {
      diffPermissions = requestedScopes;
    } else {
      diffPermissions = _.difference(requestedScopes, authorization.allowedScopes);
    }

    const permissionsAllowed = _.difference(requestedScopes, diffPermissions);

    // Ask for missing permissions
    if (!authorization || diffPermissions.length > 0) {
      return {
        application,
        permissionsToAllow: diffPermissions,
        permissionsAllowed,
      };
    }

    // Redirect if all permissions are already granted
    const state = req.query.state ? `&state=${req.query.state}` : '';

    if (responseType === 'token') {
      const accessToken = generateAccessToken(user, application, application.allowedScopes);
      return { redirectTo: `${redirectUri}?token=${accessToken.token}${state}` };
    }

    const authorizationCode = await generateAuthorizationCode(user, application, application.allowedScopes);
    return { redirectTo: `${redirectUri}?code=${authorizationCode.code}${state}` };
  },
};
