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

    const registerWorker = ({ name, initWorker }) => {
      const worker = initWorker(server);

      queue.process(name, async (job, done) => {
        let callbackCalled = false;
        const callback = (e) => {
          callbackCalled = true;
          done(e);
        };

        try {
          await worker(job, callback);
          if (!callbackCalled) {
            done();
          }
        } catch (e) {
          server.log(['worker', 'error'], `Task ${name} failed with error:\n${e.stack || e.message}`);
          done(e);
        }
      });

      server.expose(name, params => queue.create(name, params).save());
    };

    workers.forEach(registerWorker);

    server.expose({ registerWorker });
  },
};
