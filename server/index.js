const Glue = require('glue');
const config = require('config');

const manifest = {
  server: {},
  registrations: [{
    plugin: {
      register: 'good',
      options: {
        reporters: {
          consoleReporter: [{
            module: 'good-console',
            args: [{ log: '*', response: '*' }],
          }, 'stdout'],
        },
      },
    },
  }, {
    plugin: 'hapi-auth-basic',
  }, {
    plugin: {
      register: './mongodb',
      options: config.mongodb,
    },
  }, {
    plugin: './users',
  }, {
    plugin: {
      register: './oauth',
      options: config.oauth,
    },
  }],
  connections: [{
    host: 'localhost',
    port: 8000,
  }],
};

module.exports = function createServer() {
  return Glue.compose(manifest, {
    relativeTo: __dirname,
  });
};
