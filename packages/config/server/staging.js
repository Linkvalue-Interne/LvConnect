const catboxRedis = require('@hapi/catbox-redis');

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
