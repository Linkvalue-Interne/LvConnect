const Boom = require('boom');
const handlebars = require('handlebars');
const crypto = require('crypto');

const routes = require('./routes');

const contextBuilder = req => (!req.auth.credentials ? {} : {
  user: req.auth.credentials,
});

exports.register = (server, options, next) => {
  // Auth strategy for fast reconnect from third party app
  server.auth.strategy('query-token', 'bearer-access-token', {
    allowQueryToken: true,
    validateFunc(bearer, cb) {
      server.plugins.oauth.models.AccessToken.findOne({ token: bearer })
        .populate('user')
        .exec()
        .then((token) => {
          if (!token || !token.user) return cb(Boom.unauthorized('invalid_token'), false);
          if (token.expireAt < new Date()) return cb(Boom.unauthorized('token_expired'), false);
          return cb(null, true, token.user);
        });
    },
  });

  // Auth strategy for fast reconnect from password reset email
  server.auth.strategy('pkey-token', 'bearer-access-token', {
    accessTokenName: 'pkey',
    allowQueryToken: true,
    validateFunc(pkey, cb) {
      const hashedToken = crypto.createHmac('sha512', 'hello').update(pkey).digest('hex');
      this.server.app.passwordResetCache.get(hashedToken, (err, cached) => {
        if (err) return cb(err, false);
        if (!cached) return cb(null, false);

        const { User } = server.plugins.users.models;

        return User.findById(cached)
          .then(user => cb(null, !!user, user, { pkey }));
      });
    },
  });

  server.views({
    engines: { hbs: handlebars },
    relativeTo: __dirname,
    path: 'views',
    layout: 'default',
    layoutPath: 'layouts',
    helpersPath: 'helpers',
    context: contextBuilder,
  });
  server.route(routes);

  // Middleware to force user to reset his password
  const ignoredRoutes = ['/assets', '/login', '/change-password'];
  server.ext({
    type: 'onPreHandler',
    method(req, res) {
      if (!ignoredRoutes.some(r => req.path.includes(r)) && req.auth.credentials.needPasswordChange) {
        return res().redirect('/dashboard/change-password?forced=true');
      }
      return res.continue();
    },
    options: {
      sandbox: 'plugin',
    },
  });

  next();
};

exports.register.attributes = {
  name: 'dashboard',
  version: '0.0.1',
  dependencies: ['vision', 'mailjet', 'users', 'oauth'],
};
