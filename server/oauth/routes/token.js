const Joi = require('joi');
const Boom = require('boom');

const grantTypes = ['password', 'refresh_token', 'authorization_code'];

function errorFactory(error) {
  const err = Boom.badRequest();
  err.output.payload.error = error;
  return err;
}

function generateTokens(req, user, application, scopes) {
  const { generateAccessToken, generateRefreshToken } = req.server.methods;
  const { refreshTokenTTL } = req.server.plugins.oauth;

  return Promise.all([
    generateAccessToken(user, application, scopes),
    generateRefreshToken(user, application, scopes),
  ]).then(([accessToken, refreshToken]) => ({
    access_token: accessToken.token,
    token_type: 'bearer',
    expires_in: refreshTokenTTL,
    refresh_token: refreshToken.token,
    scope: scopes,
  }));
}

function handlePassword(req, application) {
  const { User } = req.server.plugins.users.models;

  return User.findOne({ email: req.payload.username })
    .then((user) => {
      if (user === null) return errorFactory('invalid_grant');
      if (user.password !== req.payload.password) return errorFactory('invalid_grant');
      return generateTokens(req, user, application, req.payload.scopes);
    });
}

function handleRefreshToken(req, application) {
  const { RefreshToken } = req.server.plugins.oauth.models;

  return RefreshToken.findOne({
    token: req.payload.refreshToken,
    expireAt: { $gt: Date.now() },
    application,
  }).then((refreshToken) => {
    if (refreshToken === null) return errorFactory('invalid_grant');
    return generateTokens(req, refreshToken.user, application, req.payload.scopes);
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
    return generateTokens(req, authorizationCode.user, application, req.payload.scopes);
  });
}

module.exports = {
  method: 'POST',
  path: '/oauth/token',
  config: {
    auth: 'application',
    validate: {
      payload: Joi.object({
        grantType: Joi.string().valid(grantTypes).required(),
        username: Joi.alternatives().when('grantType', { is: 'password', then: Joi.string().required() }),
        password: Joi.alternatives().when('grantType', { is: 'password', then: Joi.string().required() }),
        refreshToken: Joi.alternatives().when('grantType', { is: 'refresh_token', then: Joi.string().required() }),
        code: Joi.alternatives().when('grantType', { is: 'authorization_code', then: Joi.string().required() }),
        redirectUri: Joi.alternatives().when('grantType', { is: 'authorization_code', then: Joi.string().required() }),
        scope: Joi.alternatives().when('grantType', { is: 'password', then: Joi.array().items(Joi.string()) }),
      }),
    },
  },
  handler(req, rep) {
    const app = req.auth.credentials;
    switch (req.payload.grantType) {
      case 'password': return rep(handlePassword(req, app));
      case 'refresh_token': return rep(handleRefreshToken(req, app));
      case 'authorization_code': return rep(handleAuthorizationCode(req, app));
      default: return rep(errorFactory('unsupported_grant_type'));
    }
  },
};
