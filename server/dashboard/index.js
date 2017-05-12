const handlebars = require('handlebars');
const routes = require('./routes');

const contextBuilder = req => (!req.auth.credentials ? {} : {
  user: req.auth.credentials,
});

exports.register = (server, options, next) => {
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
        return res().redirect('/dashboard/change-password');
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
  dependencies: ['vision', 'mailjet', 'users'],
};
