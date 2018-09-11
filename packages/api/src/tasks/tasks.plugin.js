const kue = require('kue');

const workers = require('./workers');

module.exports = {
  name: 'tasks',
  dependencies: ['users'],
  async register(server, { redis, prefix, config }) {
    const queue = kue.createQueue({
      prefix,
      redis,
    });

    server.events.on('stop', () => queue.shutdown(config.shutdownTimeout, (err) => {
      server.log('info', `Kue shutdown: ${err || ''}`);
    }));

    workers.forEach(({ name, initWorker }) => {
      const worker = initWorker(server);

      queue.process(name, worker);
      server.expose(name, params => queue.create(name, params).save());
    });
  },
};
