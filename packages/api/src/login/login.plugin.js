const Boom = require('boom');
const crypto = require('crypto');
const uuidV4 = require('uuid/v4');

const routes = require('./routes');

module.exports = {
  name: 'login',
  dependencies: ['users', 'inert', 'hapi-auth-cookie'],
  async register(server, { cache, cookie }) {
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

    const hashPasswordResetToken = rawToken => crypto.createHmac('sha512', 'hello').update(rawToken).digest('hex');

    const storePasswordResetToken =
      (hashedToken, userId) => server.app.passwordResetCache.set(hashedToken, userId, cache.passwordResetTTL);

    const createPasswordResetToken = async (userId) => {
      const rawToken = Array.from({ length: 5 }).map(() => Buffer.from(uuidV4()).toString('base64')).join('');
      const hashedToken = hashPasswordResetToken(rawToken);
      await storePasswordResetToken(hashedToken, userId);
      return rawToken;
    };

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
      const rawToken = await createPasswordResetToken(user._id);
      server.plugins.mailjet.sendPasswordResetMail(user, rawToken);
    });

    server.expose({ createPasswordResetToken, hashPasswordResetToken });

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

    // Auth strategy for fast reconnect from third party app
    server.auth.strategy('query-token', 'bearer-access-token', {
      allowQueryToken: true,
      async validate(req, bearer) {
        const token = await server.plugins.oauth.models.AccessToken.findOne({ token: bearer })
          .populate('user')
          .exec();

        if (!token || !token.user) {
          throw Boom.unauthorized('invalid_token');
        }
        if (token.expireAt < new Date()) {
          throw Boom.unauthorized('token_expired');
        }
        return { isValid: true, credentials: token };
      },
    });

    // Auth strategy for fast reconnect from password reset email
    server.auth.strategy('pkey-token', 'bearer-access-token', {
      accessTokenName: 'pkey',
      allowQueryToken: true,
      async validate(req, pkey) {
        const hashedToken = crypto.createHmac('sha512', 'hello').update(pkey).digest('hex');
        const cached = await req.server.app.passwordResetCache.get(hashedToken);
        if (!cached) {
          return { isValid: false, credentials: null };
        }

        const { User } = req.server.plugins.users.models;

        const user = await User.findById(cached);
        return { isValid: !!user, credentials: { user }, artifacts: { pkey } };
      },
    });

    server.auth.strategy('bearer', 'bearer-access-token', {
      async validate(req, bearer) {
        const token = await server.plugins.oauth.models.AccessToken.findOne({ token: bearer }).populate('user').exec();
        if (!token || (!token.user && !token.isClientCredentialsToken)) {
          throw Boom.unauthorized('invalid_token');
        }
        if (token.expireAt < new Date()) {
          throw Boom.unauthorized('token_expired');
        }
        return { isValid: true, credentials: token };
      },
    });

    server.route(routes);
  },
};
