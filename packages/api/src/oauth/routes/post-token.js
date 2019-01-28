const Joi = require('joi');
const Boom = require('boom');
const { oauth: { scopes: validScopes } } = require('@lvconnect/config');

const grantTypes = [
  'password',
  'refresh_token',
  'authorization_code',
  'client_credentials',
];

function generateTokens(req, user, application, scope) {
  const { generateAccessToken, generateRefreshToken } = req.server.methods;
  const { accessTokenTTL } = req.server.plugins.oauth;

  return Promise.all([
    generateAccessToken(user, application, scope),
    user ? generateRefreshToken(user, application, scope) : undefined,
  ]).then(([accessToken, refreshToken]) => ({
    access_token: accessToken.token,
    token_type: 'bearer',
    expires_in: accessTokenTTL,
    refresh_token: refreshToken && refreshToken.token,
    scope,
    need_password_change: user ? user.needPasswordChange : undefined,
  }));
}

function checkScope(target, scopes) {
  return !target.some(scope => !scopes.includes(scope));
}

function handlePassword(req, application) {
  const { User } = req.server.plugins.users.models;

  const scopes = req.payload.scope || application.allowedScopes;
  if (!checkScope(scopes, application.allowedScopes)) {
    return Promise.reject(Boom.unauthorized('invalid_scope'));
  }

  return User.findOneByEmailAndPassword(req.payload.username, req.payload.password)
    .catch(() => Promise.reject(Boom.unauthorized('invalid_grant')))
    .then((user) => {
      if (user.leftAt < new Date()) {
        throw Boom.unauthorized('invalid_grant');
      }
      return generateTokens(req, user, application, scopes);
    });
}

function handleRefreshToken(req, application) {
  const { RefreshToken } = req.server.plugins.oauth.models;

  return RefreshToken.findOne({
    token: req.payload.refresh_token,
    expireAt: { $gt: Date.now() },
    application,
  }).populate('user').then((refreshToken) => {
    if (refreshToken === null || refreshToken.expireAt < new Date() || refreshToken.user.leftAt < new Date()) {
      throw Boom.unauthorized('invalid_grant');
    }

    const scopes = req.payload.scope || application.allowedScopes;
    if (!checkScope(scopes, application.allowedScopes)) {
      return Promise.reject(Boom.unauthorized('invalid_scope'));
    }

    return generateTokens(req, refreshToken.user, application, scopes);
  });
}

function handleAuthorizationCode(req, application) {
  const { AuthorizationCode } = req.server.plugins.oauth.models;

  return AuthorizationCode.findOne({
    code: req.payload.code,
    application,
    expireAt: { $gt: Date.now() },
  }).populate('user').then((authorizationCode) => {
    if (authorizationCode === null || authorizationCode.user.leftAt < new Date()) {
      throw Boom.unauthorized('invalid_grant');
    }

    const scopes = req.payload.scope || application.allowedScopes;
    if (!checkScope(scopes, application.allowedScopes)) {
      return Promise.reject(Boom.unauthorized('invalid_scope'));
    }

    return generateTokens(req, authorizationCode.user, application, scopes);
  });
}

function handleClientCredentials(req, application) {
  const scopes = (req.payload.scope || validScopes).filter(scope => /users:get/.test(scope));
  if (!checkScope(scopes, application.allowedScopes)) {
    return Promise.reject(Boom.unauthorized('invalid_scope'));
  }

  return generateTokens(req, null, application, scopes);
}

module.exports = {
  method: 'POST',
  path: '/oauth/token',
  config: {
    auth: {
      strategy: 'application',
      mode: 'optional',
    },
    validate: {
      payload: Joi.object().keys({
        grant_type: Joi.string().valid(grantTypes).required(),
        client_id: Joi.string(),
        client_secret: Joi.string(),
        username: Joi.any().when('grant_type', { is: 'password', then: Joi.string().required() }),
        password: Joi.any().when('grant_type', { is: 'password', then: Joi.string().required() }),
        refresh_token: Joi.any().when('grant_type', { is: 'refresh_token', then: Joi.string().required() }),
        code: Joi.any().when('grant_type', { is: 'authorization_code', then: Joi.string().required() }),
        scope: Joi.array().items(Joi.string().valid(validScopes))
          .when('grant_type', { is: 'refresh_token', then: Joi.optional() })
          .when('grant_type', { is: 'password', then: Joi.optional() }),
      }).unknown(),
    },
  },
  async handler(req, h) {
    let app = req.auth.credentials;
    if (!app) {
      const { client_id: appId, client_secret: appSecret } = req.payload;
      if (!appId || !appSecret) {
        throw Boom.badRequest('missing_credentials');
      }
      app = await req.server.plugins.apps.models.Application.findOne({ appId, appSecret });
      if (!app) {
        throw Boom.unauthorized('invalid_credentials');
      }
    }

    let tokens;
    switch (req.payload.grant_type) {
      case 'password':
        tokens = await handlePassword(req, app);
        break;
      case 'refresh_token':
        tokens = await handleRefreshToken(req, app);
        break;
      case 'authorization_code':
        tokens = await handleAuthorizationCode(req, app);
        break;
      case 'client_credentials':
        tokens = await handleClientCredentials(req, app);
        break;
      default:
        throw Boom.badRequest('unsupported_grant_type');
    }

    return h.response(tokens).code(201);
  },
};
