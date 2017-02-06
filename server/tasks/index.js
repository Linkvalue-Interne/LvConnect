const kue = require('kue');

const workers = require('./workers');

exports.register = (server, { host, port, db, prefix, config }, next) => {
  const queue = kue.createQueue({
    prefix,
    redis: {
      port,
      host,
      db,
    },
  });

  server.on('stop', () => queue.shutdown(config.shutdownTimeout, (err) => {
    server.log('info', `Kue shutdown: ${err || ''}`);
  }));

  workers.forEach(({ name, initWorker }) => {
    const worker = initWorker(server);

    queue.process(name, worker);
    server.expose(name, params => queue.create(name, params).save());
  });

  next();
};

exports.register.attributes = {
  name: 'tasks',
  version: '0.0.1',
  dependencies: ['users'],
};
