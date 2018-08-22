const routes = require('./routes');
const models = require('./models');

exports.register = (server, options, next) => {
  server.route(routes);
  server.expose('models', models);

  next();
};

exports.register.attributes = {
  name: 'apps',
  version: '0.0.1',
  dependencies: ['mongodb'],
};
