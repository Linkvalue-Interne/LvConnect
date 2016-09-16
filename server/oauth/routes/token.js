const Joi = require('joi');
const Boom = require('boom');
const _ = require('lodash');

const grantTypes = [
  'password',
  'refresh_token',
  'authorization_code',
  'client_credentials',
];

function errorFactory(error) {
  const err = Boom.badRequest();
  err.output.payload.error = error;
  return err;
}

function generateTokens(req, user, application, scope) {
  const { generateAccessToken, generateRefreshToken } = req.server.methods;
  const { refreshTokenTTL } = req.server.plugins.oauth;

  return Promise.all([
    generateAccessToken(user, application, scope),
    generateRefreshToken(user, application, scope),
  ]).then(([accessToken, refreshToken]) => ({
    access_token: accessToken.token,
    token_type: 'bearer',
    expires_in: refreshTokenTTL,
    refresh_token: refreshToken.token,
    scope,
  }));
}

function checkScope(target, scopes) {
  return !_.some(target, scope => !_.includes(scopes, scope));
}

function getAuthorization(req, user, application) {
  const { Authorization } = req.server.plugins.users.models;

  return Authorization.findOne({ user, application });
}

function handlePassword(req, application) {
  const { User } = req.server.plugins.users.models;
  const scopes = req.payload.scope || application.allowedScopes;

  return User.findOneByEmailAndPassword(req.payload.username, req.payload.password)
    .then(user => generateTokens(req, user, application, scopes))
    .catch(() => errorFactory('invalid_grant'));
}

function handleRefreshToken(req, application) {
  const { RefreshToken } = req.server.plugins.oauth.models;

  return RefreshToken.findOne({
    token: req.payload.refresh_token,
    expireAt: { $gt: Date.now() },
    application,
  }).then((refreshToken) => {
    if (refreshToken === null) return errorFactory('invalid_grant');
    return getAuthorization(req, refreshToken.user, application)
      .then((authorization) => {
        if (authorization === null) return errorFactory('invalid_grant');
        let scopes = authorization.allowedScopes;
        if (req.payload.scope) {
          if (!checkScope(req.payload.scope, scopes)) throw errorFactory('invalid_scope');
          scopes = req.payload.scope;
        }
        return generateTokens(req, refreshToken.user, application, scopes);
      });
  });
}

function handleAuthorizationCode(req, application) {
  const { AuthorizationCode } = req.server.plugins.oauth.models;

  return AuthorizationCode.findOne({
    code: req.payload.code,
    application,
    expireAt: { $gt: Date.now() },
  }).then((authorizationCode) => {
    if (authorizationCode === null) return errorFactory('invalid_grant');
    return generateTokens(req, authorizationCode.user, application, req.payload.scope);
  });
}

module.exports = {
  method: 'POST',
  path: '/oauth/token',
  config: {
    auth: 'application',
    validate: {
      payload: Joi.object({
        grant_type: Joi.string().valid(grantTypes).required(),
        username: Joi.alternatives().when('grant_type', { is: 'password', then: Joi.string().required() }),
        password: Joi.alternatives().when('grant_type', { is: 'password', then: Joi.string().required() }),
        refresh_token: Joi.alternatives().when('grant_type', { is: 'refresh_token', then: Joi.string().required() }),
        code: Joi.alternatives().when('grant_type', { is: 'authorization_code', then: Joi.string().required() }),
        redirect_uri: Joi.alternatives().when('grant_type', { is: 'authorization_code', then: Joi.string().required() }),
        scope: Joi.array().items(Joi.string())
          .when('grant_type', { is: 'refresh_token', then: Joi.optional() })
          .when('grant_type', { is: 'password', then: Joi.optional() }),
      }),
    },
  },
  handler(req, rep) {
    const app = req.auth.credentials;
    const { validScopes } = req.server.plugins.oauth;

    if (req.payload.scope && !checkScope(req.payload.scope, validScopes)) {
      throw errorFactory('invalid_scope');
    }

    switch (req.payload.grant_type) {
      case 'password': return rep(handlePassword(req, app));
      case 'refresh_token': return rep(handleRefreshToken(req, app));
      case 'authorization_code': return rep(handleAuthorizationCode(req, app));
      case 'client_credentials': return rep(errorFactory('unsupported_grant_type'));
      default: return rep(errorFactory('unsupported_grant_type'));
    }
  },
};
