const Boom = require('@hapi/boom');
const crypto = require('crypto');
const uuidV4 = require('uuid/v4');

const routes = require('./routes');

module.exports = {
  name: 'login',
  dependencies: ['users', 'inert'],
  async register(server, { cache }) {
    server.app.passwordResetCache = server.cache({ // eslint-disable-line no-param-reassign
      cache: 'redisCache',
      segment: 'passwordReset',
      expiresIn: cache.passwordResetTTL,
    });

    const hashPasswordResetToken = rawToken => crypto.createHmac('sha512', cache.passwordResetSecret)
      .update(rawToken)
      .digest('hex');

    const storePasswordResetToken = (hashedToken, userId, ttl) => (
      server.app.passwordResetCache.set(hashedToken, userId, ttl)
    );

    const createPasswordResetToken = async (userId, ttl = cache.passwordResetTTL) => {
      const rawToken = Array.from({ length: 5 }).map(() => Buffer.from(uuidV4()).toString('base64')).join('');
      const hashedToken = hashPasswordResetToken(rawToken);
      await storePasswordResetToken(hashedToken, userId, ttl);
      return rawToken;
    };

    server.expose({
      createPasswordResetToken,
      hashPasswordResetToken,
      resetPassword: async (user) => {
        const rawToken = await createPasswordResetToken(user._id);
        await server.plugins.mailjet.sendPasswordResetMail(user, rawToken);
      },
      cleanPasswordResetToken: token => server.app.passwordResetCache.drop(hashPasswordResetToken(token)),
    });

    // Auth strategy for fast reconnect from password reset email
    server.auth.strategy('pkey-token', 'bearer-access-token', {
      accessTokenName: 'pkey',
      allowQueryToken: true,
      async validate(req, pkey) {
        const hashedToken = hashPasswordResetToken(pkey);
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
        if (token.user) {
          const { leftAt, hiredAt } = token.user;
          if ((leftAt && leftAt.getTime() < new Date()) || (hiredAt && hiredAt.getTime() > new Date())) {
            throw Boom.unauthorized('user_disabled');
          }
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
