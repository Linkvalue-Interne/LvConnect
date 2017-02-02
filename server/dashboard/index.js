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

  next();
};

exports.register.attributes = {
  name: 'dashboard',
  version: '0.0.1',
  dependencies: ['vision'],
};
