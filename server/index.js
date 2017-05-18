const pmx = require('pmx');

let pmxProbe;
if (require.main === module && process.env.NODE_ENV === 'production') {
  pmxProbe = pmx.init({
    http: true,
    errors: true,
    custom_probes: true, // Auto expose JS Loop Latency and HTTP req/s as custom metrics
    network: true, // Network monitoring at the application level
    ports: true, // Shows which ports your app is listening on (default: false)
  });
}

const Glue = require('glue');
const config = require('config');

const globalRoutes = require('./global-routes');

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
    plugin: {
      register: 'crumb',
      options: config.csrf,
    },
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
    plugin: {
      register: './mailjet',
      options: config.mailjet,
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
    routes: {
      cors: {
        origin: ['*'],
      },
    },
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
    .then((server) => {
      server.log('info', `Server started on port ${server.connections[0].info.uri}`);

      server.route(globalRoutes);

      // Handle uncaught promise rejections
      process.on('unhandledRejection', (reason) => {
        server.log('error', `Unhandled rejection: ${reason.stack}`);
      });

      // Error probing
      if (pmxProbe) {
        server.on('log', (event, { error }) => {
          if (error) {
            pmxProbe.notify(event.data);
          }
        });
      }
    })
    .catch((err) => {
      console.error(err.stack); // eslint-disable-line no-console
      process.exit(1);
    });
}
