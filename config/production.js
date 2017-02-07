function reportingFactory(path, options) {
  return [{
    module: 'good-squeeze',
    name: 'Squeeze',
    args: [options],
  }, {
    module: 'good-squeeze',
    name: 'SafeJson',
  }, {
    module: 'good-file',
    args: [path],
  }];
}

module.exports = {
  server: {
    cache: {
      name: 'redisCache',
      engine: 'catbox-redis',
      host: process.env.REDIS_URL,
      database: 0,
      partition: 'lvc-cache',
    },
  },
  host: {
    hostname: 'lvconnect.link-value.fr',
    port: 8000,
  },
  mongodb: {
    host: 'ds145039.mlab.com',
    port: 45039,
    database: 'heroku_fcp37rmh',
    username: 'heroku_fcp37rmh',
    password: '4lqc04tkc8n4oogo873im9eo4o',
  },
  kue: {
    host: process.env.REDIS_URL,
    db: 0,
    prefix: 'lvc-kue',
  },
  logs: {
    reporters: {
      accessReporting: reportingFactory('./logs/hapi/hapi-out.log', { log: '*', response: '*' }),
      errorReporting: reportingFactory('./logs/hapi/hapi-error.log', { error: '*' }),
      workerReporting: reportingFactory('./logs/hapi/hapi-worker.log', { worker: '*' }),
    },
  },
  trello: {
    org: '54eb7142caddc666cbb12405',
    boards: ['562e0f3822bc1b14cc196615'],
  },
  github: {
    org: 'LinkValue',
  },
};
