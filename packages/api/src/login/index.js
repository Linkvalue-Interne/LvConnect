const handlebars = require('handlebars');
const crypto = require('crypto');
const uuidV4 = require('uuid/v4');

const routes = require('./routes');

exports.register = (server, { cache, cookie }, next) => {
  server.views({
    engines: { hbs: handlebars },
    relativeTo: __dirname,
    path: 'views',
    layout: 'default',
    layoutPath: 'layouts',
  });

  server.app.cache = server.cache({ // eslint-disable-line no-param-reassign
    cache: 'redisCache',
    segment: 'session',
    expiresIn: cache.sessionsTTL,
  });

  server.app.sessionsListcache = server.cache({ // eslint-disable-line no-param-reassign
    cache: 'redisCache',
    segment: 'list',
    expiresIn: cache.listsTTL,
  });

  server.app.passwordResetCache = server.cache({ // eslint-disable-line no-param-reassign
    cache: 'redisCache',
    segment: 'passwordReset',
    expiresIn: cache.passwordResetTTL,
  });

  function saveUserSessionToCache(key, value) {
    return new Promise((resolve, reject) =>
      server.app.cache.set(key, value, cache.sessionsTTL, err => (err ? reject(err) : resolve())));
  }

  function fetchUserSessionsFromCache(key) {
    return new Promise((resolve, reject) =>
      server.app.sessionsListcache.get(key, (err, value) => (err ? reject(err) : resolve(value))));
  }

  function saveUserSessionsToCache(key, sessions) {
    return new Promise((resolve, reject) =>
      server.app.sessionsListcache.set(key, sessions, cache.sessionsTTL, err => (err ? reject(err) : resolve())));
  }

  function dropSession(sid) {
    return new Promise((resolve, reject) => server.app.cache.drop(sid, err => (err ? reject(err) : resolve())));
  }

  function dropAllSessions(sids) {
    return Promise.all(sids.map(sid => dropSession(sid)));
  }

  function dropSessionList(uid) {
    return new Promise((resolve, reject) =>
      server.app.sessionsListcache.drop(uid, err => (err ? reject(err) : resolve())));
  }

  server.expose('loginUser', (req, user) => {
    const sid = uuidV4();
    const uid = user._id.toString();
    return fetchUserSessionsFromCache(uid)
      .then(sessions => saveUserSessionsToCache(uid, Object.assign(sessions || {}, { [sid]: true })))
      .then(() => saveUserSessionToCache(sid, { uid, device: req.plugins.scooter.toJSON().device.family }))
      .then(() => {
        req.cookieAuth.set({ sid });
        req.auth.credentials = user;
        return user;
      });
  });

  server.expose('logoutUser', async (req) => {
    await dropSession(req.state[cookie.name].sid);
    req.cookieAuth.clear();
  });

  server.expose('resetPassword', (user) => {
    const rawToken = Array.from({ length: 5 }).map(() => Buffer.from(uuidV4()).toString('base64')).join('');
    const hashedToken = crypto.createHmac('sha512', 'hello').update(rawToken).digest('hex');
    return new Promise((resolve, reject) =>
      server.app.passwordResetCache.set(hashedToken, user._id, cache.passwordResetTTL, err =>
        (err ? reject(err) : resolve())))
      .then(() => server.plugins.mailjet.sendPasswordResetMail(user, rawToken));
  });

  server.expose('cleanupUserSessions', uid => fetchUserSessionsFromCache(uid)
    .then(sessions => dropAllSessions(Object.keys(sessions || {})))
    .then(() => dropSessionList(uid)));

  server.auth.strategy('session', 'cookie', {
    password: cookie.secret,
    cookie: cookie.name,
    redirectTo: cookie.redirect,
    isSecure: cookie.isSecure,
    isSameSite: cookie.isSameSite,
    clearInvalid: true,
    validateFunc(request, session, callback) {
      request.server.app.cache.get(session.sid, (err, cached) => {
        if (err) return callback(err, false);
        if (!cached) return callback(null, false);

        const { User } = server.plugins.users.models;

        return User.findById(cached.uid)
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
