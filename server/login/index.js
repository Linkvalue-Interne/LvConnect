const routes = require('./routes');
const handlebars = require('handlebars');

exports.register = (server, options, next) => {
  server.views({
    engines: { hbs: handlebars },
    relativeTo: __dirname,
    path: 'views',
  });

  server.route(routes);
  next();
};

exports.register.attributes = {
  name: 'login',
  version: '0.0.1',
  dependencies: ['users', 'hapi-auth-cookie', 'vision'],
};
