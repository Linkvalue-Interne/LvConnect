const client = require('prom-client');
const Boom = require('boom');

const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'HTTP Requests per seconds',
  labelNames: ['method', 'path'],
});
const { collectDefaultMetrics } = client;
collectDefaultMetrics(5000);

exports.register = (server, config, next) => {
  const { User } = server.plugins.users.models;

  server.auth.strategy('metrics', 'basic', {
    validateFunc(req, username, password, cb) {
      return User.findOneByEmailAndPassword(username, password)
        .catch(() => Promise.reject(Boom.unauthorized('Username or password invalid')))
        .then((user) => {
          if (user === null) return cb(Boom.unauthorized('Username or password invalid'), false);
          return cb(null, true, user);
        })
        .catch(err => cb(Boom.wrap(err), false));
    },
  });

  server.route({
    method: 'GET',
    path: '/metrics',
    config: { auth: 'metrics' },
    handler(req, res) {
      res(client.register.metrics())
        .type(client.register.contentType);
    },
  });

  server.on({ name: 'request-internal', filter: 'handler' }, (req) => {
    if (!/\/(assets|favicon|metrics)/.test(req.path)) {
      requestCounter.labels(req.method, req.route.path).inc();
    }
  });

  next();
};

exports.register.attributes = {
  name: 'monitoring',
  version: '0.0.1',
  dependencies: ['users'],
};
