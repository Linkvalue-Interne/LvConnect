const moment = require('moment');
const handlebars = require('handlebars');
const Boom = require('boom');
const models = require('./models');
const routes = require('./routes');
const validScopes = require('./scopes');
const getFormUrl = require('./routes/methods/get-form-url');

const contextBuilder = req => (!req.auth.credentials ? {} : {
  user: req.auth.credentials,
  logoutUrl: `/logout?redirect=${encodeURIComponent(getFormUrl(req))}`,
  redirectUri: req.query.redirect_uri,
  state: req.query.state,
});

exports.register = (server, { accessTokenTTL, refreshTokenTTL, authorizationCodeTTL }, next) => {
  server.expose('models', models);
  server.expose('accessTokenTTL', moment.duration(accessTokenTTL).asSeconds());
  server.expose('validScopes', validScopes);

  const {
    AccessToken,
    RefreshToken,
    AuthorizationCode,
    Authorization,
    Application,
  } = models;

  server.views({
    engines: { hbs: handlebars },
    relativeTo: __dirname,
    layout: 'default',
    layoutPath: 'layouts',
    path: 'views',
    context: contextBuilder,
  });

  server.method('generateAccessToken', (user, application, scopes) => {
    const token = new AccessToken({
      user,
      application,
      expireAt: moment().add(moment.duration(accessTokenTTL)).toDate(),
      scopes,
    });
    return token.save();
  });

  server.method('generateRefreshToken', (user, application, scopes) => {
    const token = new RefreshToken({
      user,
      application,
      expireAt: moment().add(moment.duration(refreshTokenTTL)).toDate(),
      scopes,
    });
    return token.save();
  });

  server.method('generateAuthorizationCode', (user, application, scopes) => {
    const token = new AuthorizationCode({
      user,
      application,
      expireAt: moment().add(moment.duration(authorizationCodeTTL)).toDate(),
      scopes,
    });
    return token.save();
  });

  server.method('cleanupUserAuth', (user) => {
    const cleanupModels = [AccessToken, RefreshToken, AuthorizationCode, Authorization];
    return Promise.all(cleanupModels.map(model => model.remove({ user }).exec()));
  });

  server.expose('cleanupUserTokens', (user) => {
    const cleanupModels = [AccessToken, RefreshToken, AuthorizationCode];
    return Promise.all(cleanupModels.map(model => model.remove({ user }).exec()));
  });

  server.auth.strategy('application', 'basic', {
    validateFunc(req, appId, appSecret, cb) {
      Application.findOne({ appId, appSecret })
        .then((application) => {
          if (application === null) return cb(Boom.unauthorized('invalid_client'), false);
          return cb(null, true, application);
        })
        .catch(err => cb(Boom.wrap(err), false));
    },
  });

  server.auth.strategy('bearer', 'bearer-access-token', {
    validateFunc(bearer, cb) {
      AccessToken.findOne({ token: bearer })
        .populate('user')
        .exec()
        .then((token) => {
          if (!token || !token.user) return cb(Boom.unauthorized('invalid_token'), false);
          if (token.expireAt < new Date()) return cb(Boom.unauthorized('token_expired'), false);
          return cb(null, true, token);
        });
    },
  });

  server.auth.default('bearer');

  server.route(routes);
  next();
};

exports.register.attributes = {
  name: 'oauth',
  version: '0.0.1',
  dependencies: ['mongodb', 'users', 'hapi-auth-basic', 'hapi-auth-bearer-token'],
};
