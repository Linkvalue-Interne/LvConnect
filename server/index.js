const Glue = require('glue');
const config = require('config');

const manifest = {
  server: {},
  connections: [{
    port: 8000,
  }],
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
    plugin: {
      register: './mongodb',
      options: config.mongodb,
    },
  }, {
    plugin: './oauth',
  }],
};

const options = {
  relativeTo: __dirname,
};

Glue.compose(manifest, options)
  .then(server => server.start().then(() => server.log('info', 'Server started')))
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
