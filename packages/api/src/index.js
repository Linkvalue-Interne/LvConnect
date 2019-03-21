const Glue = require('glue');
const config = require('@lvconnect/config/server');

const globalRoutes = require('./global-routes');

const manifest = {
  server: {
    host: config.host.hostname,
    port: config.host.port,
    cache: config.server.cache,
    routes: {
      validate: {
        failAction: (req, h, err) => {
          req.server.log('error', err);
          throw err;
        },
      },
      cors: {
        origin: ['http://localhost:8001'],
      },
    },
  },
  register: {
    plugins: [
      ...(process.env.APP_ENV !== 'test' ? [{
        plugin: 'good',
        options: {
          reporters: {
            consoleReporter: [{
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{ log: '*', response: '*' }],
            }, {
              module: 'good-console',
            }, 'stdout'],
          },
        },
      }] : []),
      'hapi-auth-basic',
      'hapi-auth-bearer-token',
      { plugin: 'crumb', options: config.csrf },
      'scooter',
      'inert',
      { plugin: './mongodb/mongodb.plugin', options: config.mongodb },
      { plugin: './mailjet/mailjet.plugin', options: config.mailjet },
      { plugin: './tasks/tasks.plugin', options: config.kue },
      './apps/apps.plugin',
      './hooks/hooks.plugin',
      './users/users.plugin',
      { plugin: './monitoring/monitoring.plugin', options: config.monitoring },
      { plugin: './login/login.plugin', options: config.login },
      { plugin: './oauth/oauth.plugin', options: config.oauth },
    ],
  },
};

const createServer = () => Glue.compose(manifest, { relativeTo: __dirname });

const createAndInitServer = async () => {
  try {
    const server = await createServer();

    server.route(globalRoutes);

    await server.start();
    server.log('info', `Server started on ${server.info.uri}`);

    // Handle uncaught promise rejections
    process.on('unhandledRejection', (reason) => {
      server.log('error', `Unhandled rejection: ${reason.stack}`);
    });
  } catch (err) {
    console.error(err.stack); // eslint-disable-line no-console
    process.exit(1);
  }
};

module.exports = {
  createServer,
  createAndInitServer,
};
