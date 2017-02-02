const routes = require('./routes');
const handlebars = require('handlebars');

exports.register = (server, { cache, cookie }, next) => {
  server.views({
    engines: { hbs: handlebars },
    relativeTo: __dirname,
    path: 'views',
  });

  server.app.cache = server.cache({ // eslint-disable-line no-param-reassign
    cache: 'redisCache',
    segment: 'sessions',
    expiresIn: cache.ttl,
  });

  server.auth.strategy('session', 'cookie', {
    password: cookie.secret,
    cookie: cookie.name,
    redirectTo: cookie.redirect,
    isSecure: cookie.isSecure,
    validateFunc(request, session, callback) {
      request.server.app.cache.get(session.sid, (err, cached) => {
        if (err) return callback(err, false);
        if (!cached) return callback(null, false);

        const { User } = server.plugins.users.models;

        return User.findById(cached.user._id)
          .then(user => callback(null, !!user, user));
      });
    },
  });

  server.route(routes);
  next();
};

exports.register.attributes = {
  name: 'login',
  version: '0.0.1',
  dependencies: ['users', 'vision', 'inert', 'hapi-auth-cookie'],
};
