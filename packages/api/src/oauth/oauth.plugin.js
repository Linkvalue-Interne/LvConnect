const moment = require('moment');
const Boom = require('@hapi/boom');
const escapeRegExp = require('lodash/escapeRegExp');
const models = require('./models');
const uuidHash = require('../uuid-hash');
const routes = require('./routes');

module.exports = {
  name: 'oauth',
  version: '0.0.1',
  dependencies: ['mongodb', 'apps', 'users', 'basic', 'hapi-auth-bearer-token'],
  async register(server, { accessTokenTTL, refreshTokenTTL, authorizationCodeTTL, scopes: validScopes }) {
    server.expose('models', models);
    server.expose('accessTokenTTL', moment.duration(accessTokenTTL).asSeconds());
    server.expose('validScopes', validScopes);

    const {
      AccessToken,
      RefreshToken,
      AuthorizationCode,
      Authorization,
    } = models;
    const { Application } = server.plugins.apps.models;

    server.method('generateAccessToken', (user, application, scopes) => AccessToken.create({
      user,
      isClientCredentialsToken: !user,
      application,
      expireAt: moment().add(moment.duration(accessTokenTTL)).toDate(),
      scopes,
    }));

    server.method('generateRefreshToken', (user, application, scopes) => RefreshToken.create({
      user,
      application,
      expireAt: moment().add(moment.duration(refreshTokenTTL)).toDate(),
      scopes,
    }));

    server.method('generateAuthorizationCode', (user, application, scopes) => AuthorizationCode.create({
      user,
      application,
      expireAt: moment().add(moment.duration(authorizationCodeTTL)).toDate(),
      scopes,
    }));

    server.method('cleanupUserAuth', (user) => {
      const cleanupModels = [AccessToken, RefreshToken, AuthorizationCode, Authorization];
      return Promise.all(cleanupModels.map(model => model.remove({ user }).exec()));
    });

    server.method('uuidHash', uuidHash);

    server.expose('cleanupUserTokens', (user) => {
      const cleanupModels = [AccessToken, RefreshToken, AuthorizationCode];
      return Promise.all(cleanupModels.map(model => model.remove({ user }).exec()));
    });

    server.method('isRedirectUriAllowedForApplication', (redirectUri, application) => {
      const matchedApplicationRedirectUri = application.redirectUris.find((uri) => {
        if (uri.includes('*')) {
          const regexpUri = escapeRegExp(uri).replace('\\*', '\\S+');
          return redirectUri.match(new RegExp(regexpUri));
        }

        return redirectUri === uri;
      });

      return !!matchedApplicationRedirectUri;
    });

    server.auth.strategy('application', 'basic', {
      async validate(req, appId, appSecret) {
        const application = await Application.findOne({ appId, appSecret });
        if (!application) {
          throw Boom.unauthorized('invalid_client');
        }
        return { isValid: true, credentials: application };
      },
    });

    server.auth.default('bearer');

    server.route(routes);
  },
};
