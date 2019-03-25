const catboxRedis = require('catbox-redis');

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
      provider: {
        constructor: catboxRedis,
        options: {
          socket: process.env.REDIS_URL,
          database: 0,
          partition: 'lvc-cache',
        },
      },
    },
    cors: {
      origin: ['https://lvconnect-staging.herokuapp.com'],
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
  logs: {
    reporters: {
      accessReporting: reportingFactory('./logs/hapi/hapi-out.log', { log: '*', response: '*' }),
      errorReporting: reportingFactory('./logs/hapi/hapi-error.log', { error: '*' }),
      workerReporting: reportingFactory('./logs/hapi/hapi-worker.log', { worker: '*' }),
    },
  },
  mailjet: {
    baseUrl: 'https://lvconnect-staging.herokuapp.com',
  },
  trello: {
    org: '54eb7142caddc666cbb12405',
    boards: ['562e0f3822bc1b14cc196615'],
  },
  github: {
    org: 'LinkValue',
  },
};
