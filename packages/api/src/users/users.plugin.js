const routes = require('./routes');
const models = require('./models');

module.exports = {
  name: 'users',
  dependencies: ['mongodb', 'mailjet'],
  async register(server) {
    server.route(routes);
    server.expose('models', models);
  },
};
