const Glue = require('glue');
const config = require('config');

const manifest = {
  server: {
    cache: config.server.cache,
  },
  registrations: [{
    plugin: {
      register: 'good',
      options: config.logs,
    },
  }, {
    plugin: 'hapi-auth-cookie',
  }, {
    plugin: 'hapi-auth-basic',
  }, {
    plugin: 'hapi-auth-bearer-token',
  }, {
    plugin: 'vision',
  }, {
    plugin: 'inert',
  }, {
    plugin: {
      register: './mongodb',
      options: config.mongodb,
    },
  }, {
    plugin: './users',
  }, {
    plugin: {
      register: './login',
      options: config.login,
    },
  }, {
    plugin: {
      register: './oauth',
      options: config.oauth,
    },
  }, {
    plugin: './dashboard',
  }, {
    plugin: {
      register: './tasks',
      options: config.kue,
    },
  }],
  connections: [{
    host: config.host.hostname,
    port: config.host.port,
  }],
};

function createServer() {
  return Glue.compose(manifest, {
    relativeTo: __dirname,
  });
}

module.exports = createServer;

if (require.main === module) {
  createServer()
    .then(server => server.start().then(() => server))
    .then(server => server.log('info', `Server started on port ${server.connections[0].info.uri}`))
    .catch((err) => {
      console.error(err.stack); // eslint-disable-line no-console
      process.exit(1);
    });
}
