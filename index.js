const createServer = require('./server');

createServer()
  .then(server => server.start().then(() => server))
  .then(server => server.log('info', `Server started on port ${server.connections[0].info.uri}`))
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  });
