const Glue = require('@hapi/glue');
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
      cors: config.server.cors,
    },
  },
  register: {
    plugins: [
      {
        plugin: '@hapi/good',
        options: {
          reporters: {
            consoleReporter: [{
              module: '@hapi/good-squeeze',
              name: 'Squeeze',
              args: [{ log: '*', response: '*', error: '*' }],
            }, {
              module: '@hapi/good-console',
            }, 'stdout'],
          },
        },
      },
      '@hapi/basic',
      'hapi-auth-bearer-token',
      { plugin: '@hapi/crumb', options: config.csrf },
      '@hapi/scooter',
      '@hapi/inert',
      { plugin: './mongodb/mongodb.plugin', options: config.mongodb },
      { plugin: './mailjet/mailjet.plugin', options: config.mailjet },
      { plugin: './tasks/tasks.plugin', options: config.kue },
      './apps/apps.plugin',
      './hooks/hooks.plugin',
      './users/users.plugin',
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
