const client = require('prom-client');
const Boom = require('boom');

const metrics = {
  // This allows to measure request response time repartition by quantiles
  httpRequestDurationMilliseconds: new client.Summary({
    name: 'http_request_duration_milliseconds',
    help: 'Response time in milliseconds by quantiles.',
    labelNames: ['method', 'path', 'status'],
  }),
  // This allows to rank request response time in 3 buckets: 0-500, 500-1500 and 1500-+Inf (used for Apdex)
  httpRequestBucketMilliseconds: new client.Histogram({
    name: 'http_request_bucket_milliseconds',
    help: 'Bucketed response time in milliseconds.',
    buckets: [500, 1500],
    labelNames: ['method', 'path', 'status'],
  }),
  // Total request counter to measure usage of each routes
  httpRequestsTotal: new client.Counter({
    name: 'http_requests_total',
    help: 'Paths taken in the app.',
    labelNames: ['path', 'method'],
  }),
  // Total server error counter (crashes and timeouts)
  httpRequestsErrorTotal: new client.Counter({
    name: 'http_server_error_total',
    help: 'Error codes returned.',
    labelNames: ['path', 'method'],
  }),
  // Total and Type of error counter
  httpRequestsErrorTotalByType: new client.Counter({
    name: 'http_error_by_type',
    help: 'Number of errors by error code',
    labelNames: ['path', 'method', 'code'],
  }),
};

exports.register = (server, config, next) => {
  client.collectDefaultMetrics(5000);
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
    path: config.metricsPath,
    config: { auth: 'metrics' },
    handler(req, res) {
      res(client.register.metrics())
        .type(client.register.contentType);
    },
  });

  server.on({ name: 'request-internal', filter: 'received' }, (req) => {
    if (req.path !== config.metricsPath && req.path.startsWith('/api')) {
      metrics.httpRequestsTotal.inc({ path: req.path, method: req.method });
    }
  });

  server.on('response', (req) => {
    if (req.path !== config.metricsPath && req.path.startsWith('/api')) {
      const time = req.info.responded - req.info.received;
      metrics.httpRequestDurationMilliseconds.labels(req.method, req.path, req.response.statusCode).observe(time);
      metrics.httpRequestBucketMilliseconds.labels(req.method, req.path, req.response.statusCode).observe(time);

      if (req.response.statusCode >= 400) {
        metrics.httpRequestsErrorTotal.inc({ path: req.path, method: req.method });
        metrics.httpRequestsErrorTotalByType.inc({ path: req.path, method: req.method, code: req.response.statusCode });
      }
    }
  });

  next();
};

exports.register.attributes = {
  name: 'monitoring',
  version: '0.0.1',
  dependencies: ['users'],
};
