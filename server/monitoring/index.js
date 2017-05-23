const client = require('prom-client');

const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'HTTP Requests per seconds',
  labelNames: ['method', 'path'],
});
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(5000);

exports.register = (server, config, next) => {
  server.route({
    method: 'GET',
    path: '/metrics',
    handler(req, res) {
      res(client.register.metrics())
        .type(client.register.contentType);
    },
  });

  server.on({ name: 'request-internal', filter: 'received' }, (req) => {
    if (!/\/(assets|favicon|metrics)/.test(req.path)) {
      requestCounter.labels(req.method, req.route.path).inc();
    }
  });

  next();
};

exports.register.attributes = {
  name: 'monitoring',
  version: '0.0.1',
};
