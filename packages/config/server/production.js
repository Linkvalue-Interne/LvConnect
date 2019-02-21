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
      socket: process.env.REDIS_URL,
      database: 0,
      partition: 'lvc-cache',
    },
  },
  host: {
    port: process.env.PORT || 8000,
  },
  mongodb: {
    url: process.env.MONGODB_URI,
  },
  kue: {
    redis: `${process.env.REDIS_URL}/1`,
    prefix: 'lvc-kue',
  },
  login: {
    cookie: {
      name: 'lvconnect',
      isSecure: true,
    },
  },
  logs: {
    reporters: {
      accessReporting: reportingFactory('./logs/hapi/hapi-out.log', { log: '*', response: '*' }),
      errorReporting: reportingFactory('./logs/hapi/hapi-error.log', { error: '*' }),
      workerReporting: reportingFactory('./logs/hapi/hapi-worker.log', { worker: '*' }),
    },
  },
  mailjet: {
    baseUrl: 'https://lvconnect.link-value.fr',
  },
  trello: {
    org: '54eb7142caddc666cbb12405',
    boards: ['562e0f3822bc1b14cc196615'],
  },
  github: {
    org: 'LinkValue',
  },
};
