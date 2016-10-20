const kue = require('kue');

exports.register = (server, { host, port, db, prefix, config }, next) => {
  const queue = kue.createQueue({
    prefix,
    redis: {
      port,
      host,
      db,
    },
  });

  server.expose('queue', queue);
  server.on('stop', () => queue.shutdown(config.shutdownTimeout, (err) => {
    server.log('info', `Kue shutdown: ${err || ''}`);
  }));
  next();
};

exports.register.attributes = {
  name: 'kue',
  version: '0.0.1',
};
