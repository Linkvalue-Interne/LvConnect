const handlebars = require('handlebars');
const crypto = require('crypto');
const uuidV4 = require('uuid/v4');

const routes = require('./routes');

module.exports = {
  name: 'login',
  dependencies: ['users', 'vision', 'inert', 'hapi-auth-cookie'],
  async register(server, { cache, cookie }) {
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

    const saveUserSessionToCache = (key, value) => server.app.cache.set(key, value, cache.sessionsTTL);

    const fetchUserSessionsFromCache = key => server.app.sessionsListcache.get(key);

    const saveUserSessionsToCache = (key, sessions) =>
      server.app.sessionsListcache.set(key, sessions, cache.sessionsTTL);

    const dropSession = sid => server.app.cache.drop(sid);

    const dropAllSessions = sids => Promise.all(sids.map(sid => dropSession(sid)));

    const dropSessionList = uid => new Promise((resolve, reject) =>
      server.app.sessionsListcache.drop(uid, err => (err ? reject(err) : resolve())));

    server.expose('loginUser', async (req, user) => {
      const sid = uuidV4();
      const uid = user._id.toString();
      const sessions = await fetchUserSessionsFromCache(uid);
      await saveUserSessionsToCache(uid, Object.assign(sessions || {}, { [sid]: true }));
      await saveUserSessionToCache(sid, { uid, device: req.plugins.scooter.toJSON().device.family });
      req.cookieAuth.set({ sid });
      req.auth.credentials = user;
      return user;
    });

    server.expose('logoutUser', async (req) => {
      await dropSession(req.state[cookie.name].sid);
      req.cookieAuth.clear();
    });

    server.expose('resetPassword', async (user) => {
      const rawToken = Array.from({ length: 5 }).map(() => Buffer.from(uuidV4()).toString('base64')).join('');
      const hashedToken = crypto.createHmac('sha512', 'hello').update(rawToken).digest('hex');
      await server.app.passwordResetCache.set(hashedToken, user._id, cache.passwordResetTTL);
      server.plugins.mailjet.sendPasswordResetMail(user, rawToken);
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
      async validateFunc(request, session) {
        const cached = await request.server.app.cache.get(session.sid);
        if (!cached) return { valid: false, credentials: null };
        const { User } = server.plugins.users.models;
        const user = await User.findById(cached.uid);
        return { valid: true, credentials: user };
      },
    });

    server.route(routes);
  },
};
