const Joi = require('joi');
const Boom = require('boom');
const _ = require('lodash');
const { oauth: { scopes: validScopes } } = require('@lvconnect/config');

module.exports = {
  method: 'POST',
  path: '/oauth/authorize',
  config: {
    auth: 'bearer',
    validate: {
      payload: Joi.object({
        scopes: Joi.array().items(Joi.string().valid(validScopes)).required(),
      }),
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

    const { models: { Authorization } } = req.server.plugins.oauth;
    const { Application } = req.server.plugins.apps.models;
    const { generateAuthorizationCode, generateAccessToken, isRedirectUriAllowedForApplication } = req.server.methods;
    const { user } = req.auth.credentials;
    const {
      redirect_uri: redirectUri,
      app_id: appId,
      client_id: clientId,
      response_type: responseType,
    } = req.query;

    const application = await Application.findOne({ appId: clientId || appId });
    let authorization = await Authorization.findOne({ user, application });
    if (!isRedirectUriAllowedForApplication(redirectUri, application)) {
      throw Boom.badRequest('invalid_redirect_uri');
    }

    const { scopes } = req.payload;
    const invalidScopes = _.difference(scopes, _.intersection(validScopes, application.allowedScopes));
    if (invalidScopes.length > 0) {
      throw Boom.badRequest('invalid_scopes');
    }

    if (authorization === null) {
      authorization = await Authorization.create({
        user,
        application,
        allowedScopes: scopes,
      });
    }

    await Authorization.findByIdAndUpdate(authorization._id, {
      $set: { allowedScopes: _.uniq([...authorization.allowedScopes, ...scopes]) },
    });

    const state = req.query.state ? `&state=${req.query.state}` : '';
    const decodedRedirectUri = decodeURIComponent(redirectUri);
    if (responseType === 'token') {
      const accessToken = await generateAccessToken(user, application, scopes);
      return { redirectTo: `${decodedRedirectUri}?token=${accessToken.token}${state}` };
    }

    const authorizationCode = await generateAuthorizationCode(user, application, scopes);
    return { redirectTo: `${decodedRedirectUri}?code=${authorizationCode.code}${state}` };
  },
};
