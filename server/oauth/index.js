const models = require('./models');
const routes = require('./routes');

exports.register = (server, options, next) => {
  server.route(routes);

  server.expose('models', models);

  next();
};

exports.register.attributes = {
  name: 'oauth',
  version: '0.0.1',
  dependencies: ['mongodb'],
};
