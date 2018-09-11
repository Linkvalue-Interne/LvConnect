const Boom = require('boom');
const handlebars = require('handlebars');
const crypto = require('crypto');

const routes = require('./routes');

const contextBuilder = req => (!req.auth.credentials ? {} : {
  user: req.auth.credentials,
});

module.exports = {
  name: 'dashboard',
  dependencies: ['vision', 'mailjet', 'users', 'oauth'],
  async register(server) {
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
        return { isValid: true, credentials: token.user };
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
        return { isValid: !!user, credentials: user, artifacts: { pkey } };
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
          return res.redirect('/old/dashboard/change-password?forced=true').takeover();
        }
        return res.continue;
      },
      options: {
        sandbox: 'plugin',
      },
    });
  },
};
