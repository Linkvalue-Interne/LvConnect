'use strict';

const Glue = require('glue');

const manifest = {
  connections: [{
    port: 8000,
  }],
  registrations: [{
    plugin: {
      register: 'good',
      options: {
        reporters: {
          consoleReporter: [{
            module: 'good-console'
          }, 'stdout'],
        }
      }
    }
  }, {
    plugin: './oauth',
  }]
};

const options = {
  relativeTo: __dirname
};

Glue.compose(manifest, options)
  .then((server) => {
    server.start(() => {
      console.log('hapi days!');
    });
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
