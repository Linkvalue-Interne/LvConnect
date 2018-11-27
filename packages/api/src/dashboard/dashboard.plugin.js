const handlebars = require('handlebars');

const routes = require('./routes');

const contextBuilder = req => (!req.auth.credentials ? {} : {
  user: req.auth.credentials,
});

module.exports = {
  name: 'dashboard',
  dependencies: ['vision', 'mailjet', 'users', 'oauth'],
  async register(server) {
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
