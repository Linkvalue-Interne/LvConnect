const moment = require('moment');
const models = require('./models');
const routes = require('./routes');

const validScopes = [
  'user:get',
  'user:create',
  'user:delete',
  'user:modify',
  'application:get',
  'application:create',
  'application:delete',
  'application:modify',
  'profile:get',
  'profile:modify',
];

exports.register = (server, { accessTokenTTL, refreshTokenTTL }, next) => {
  server.expose('models', models);
  server.expose('accessTokenTTL', moment.duration(accessTokenTTL).seconds());
  server.expose('validScopes', validScopes);

  const { AccessToken, RefreshToken, Application } = models;

  server.method('generateAccessToken', (user, application, scopes) => {
    const token = new AccessToken({
      user,
      application,
      expireAt: moment().add(moment.duration(accessTokenTTL)),
      scopes,
    });
    return token.save();
  });

  server.method('generateRefreshToken', (user, application, scopes) => {
    const token = new RefreshToken({
      user,
      application,
      expireAt: moment().add(moment.duration(refreshTokenTTL)),
      scopes,
    });
    return token.save();
  });

  server.auth.strategy('application', 'basic', {
    validateFunc(req, appId, appSecret, cb) {
      Application.findOne({ appId, appSecret })
        .then((application) => {
          if (application === null) return cb(null, false);
          return cb(null, true, application);
        })
        .catch(cb);
    },
  });

  server.route(routes);
  next();
};

exports.register.attributes = {
  name: 'oauth',
  version: '0.0.1',
  dependencies: ['mongodb', 'users', 'hapi-auth-basic'],
};
