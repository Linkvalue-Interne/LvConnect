const Joi = require('joi');
const Boom = require('boom');

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
      return user.comparePassword(req.payload.password)
        .then((validPassword) => {
          if (!validPassword) return errorFactory('invalid_grant');
          return generateTokens(req, user, application, req.payload.scopes);
        });
    });
}

function handleRefreshToken(req, application) {
  const { RefreshToken } = req.server.plugins.oauth.models;
  const { validScopes } = req.server.plugins.oauth;

  return RefreshToken.findOne({
    token: req.payload.refresh_token,
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
        grant_type: Joi.string().valid(grantTypes).required(),
        username: Joi.alternatives().when('grant_type', { is: 'password', then: Joi.string().required() }),
        password: Joi.alternatives().when('grant_type', { is: 'password', then: Joi.string().required() }),
        refresh_token: Joi.alternatives().when('grant_type', { is: 'refresh_token', then: Joi.string().required() }),
        code: Joi.alternatives().when('grant_type', { is: 'authorization_code', then: Joi.string().required() }),
        redirect_uri: Joi.alternatives().when('grant_type', { is: 'authorization_code', then: Joi.string().required() }),
        scope: Joi.array().items(Joi.string())
          .when('grant_type', { is: 'refresh_token', then: Joi.optional() })
          .when('grant_type', { is: 'password', then: Joi.required() }),
      }),
    },
  },
  handler(req, rep) {
    const app = req.auth.credentials;
    switch (req.payload.grant_type) {
      case 'password': return rep(handlePassword(req, app));
      case 'refresh_token': return rep(handleRefreshToken(req, app));
      case 'authorization_code': return rep(handleAuthorizationCode(req, app));
      case 'client_credentials': return rep(errorFactory('unsupported_grant_type'));
      default: return rep(errorFactory('unsupported_grant_type'));
    }
  },
};
