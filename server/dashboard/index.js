const handlebars = require('handlebars');
const routes = require('./routes');

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
  name: 'dashboard',
  version: '0.0.1',
  dependencies: ['vision'],
};
