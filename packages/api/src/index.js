const Glue = require('glue');
const config = require('@lvconnect/config/server');

const globalRoutes = require('./global-routes');

const manifest = {
  server: {
    cache: config.server.cache,
  },
  registrations: [
    ...(process.env.APP_ENV !== 'test' ? [{
      plugin: {
        register: 'good',
        options: config.logs,
      },
    }] : []),
    {
      plugin: 'hapi-auth-cookie',
    },
    {
      plugin: 'hapi-auth-basic',
    },
    {
      plugin: 'hapi-auth-bearer-token',
    },
    {
      plugin: {
        register: 'crumb',
        options: config.csrf,
      },
    },
    {
      plugin: 'vision',
    },
    {
      plugin: 'scooter',
    },
    {
      plugin: 'inert',
    },
    {
      plugin: {
        register: './mongodb',
        options: config.mongodb,
      },
    },
    {
      plugin: {
        register: './mailjet',
        options: config.mailjet,
      },
    },
    {
      plugin: './apps',
    },
    {
      plugin: './users',
    },
    {
      plugin: {
        register: './monitoring',
        options: config.monitoring,
      },
    },
    {
      plugin: {
        register: './login',
        options: config.login,
      },
    },
    {
      plugin: {
        register: './oauth',
        options: config.oauth,
      },
    },
    {
      plugin: {
        register: './dashboard',
        routes: {
          prefix: '/old',
        },
      },
    },
    {
      plugin: {
        register: './tasks',
        options: config.kue,
      },
    },
  ],
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

function createAndInitServer() {
  createServer()
    .then(server => server.start().then(() => server))
    .then((server) => {
      server.log('info', `Server started on port ${server.connections[0].info.uri}`);

      server.route(globalRoutes);

      // Handle uncaught promise rejections
      process.on('unhandledRejection', (reason) => {
        server.log('error', `Unhandled rejection: ${reason.stack}`);
      });
    })
    .catch((err) => {
      console.error(err.stack); // eslint-disable-line no-console
      process.exit(1);
    });
}

module.exports = {
  createServer,
  createAndInitServer,
};