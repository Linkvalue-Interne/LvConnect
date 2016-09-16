const moment = require('moment');
const models = require('./models');
const routes = require('./routes');

exports.register = (server, { accessTokenTTL, refreshTokenTTL }, next) => {
  server.expose('models', models);
  server.expose('accessTokenTTL', moment.duration(accessTokenTTL).seconds());

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

  server.auth.strategy('bearer', 'bearer-access-token', {
    validateFunc(bearer, cb) {
      AccessToken.findOne({ token: bearer })
        .populate('user')
        .exec()
        .then((token) => {
          if (!token) return cb(null, false);
          return cb(null, true, token.user);
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
