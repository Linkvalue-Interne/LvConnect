const routes = require('./routes');
const models = require('./models');

module.exports = {
  name: 'apps',
  dependencies: ['mongodb'],
  async register(server) {
    server.route(routes);
    server.expose('models', models);
  },
};
