const routes = require('./routes');
const handlebars = require('handlebars');

exports.register = (server, { cache, cookie }, next) => {
  server.views({
    engines: { hbs: handlebars },
    relativeTo: __dirname,
    path: 'views',
  });

  const appCache = server.cache({
    segment: 'sessions',
    expiresIn: cache.ttl,
  });

  server.app.cache = appCache; // eslint-disable-line no-param-reassign

  server.auth.strategy('session', 'cookie', {
    password: cookie.secret,
    cookie: cookie.name,
    redirectTo: cookie.redirect,
    isSecure: cookie.isSecure,
    validateFunc(request, session, callback) {
      appCache.get(session.sid, (err, cached) => {
        if (err) return callback(err, false);
        if (!cached) return callback(null, false);

        return callback(null, true, cached.user);
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
