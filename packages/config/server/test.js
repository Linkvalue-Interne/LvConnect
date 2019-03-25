const catboxMemory = require('catbox-memory');

module.exports = {
  server: {
    cache: {
      name: 'redisCache',
      provider: {
        constructor: catboxMemory,
        options: {
          partition: 'lvc-cache',
        },
      },
    },
    cors: {
      origin: ['http://localhost:8000', 'http://localhost:8080'],
    },
  },
  mongodb: {
    url: 'mongodb://mongo:27017/lvconnect_test',
  },
  kue: {
    redis: 'redis://redis:6379/1',
    prefix: 'lvc-kue',
    config: {
      shutdownTimeout: 5000,
    },
  },
  csrf: {
    skip: () => true,
    cookieOptions: {
      isSecure: false,
      password: '12345678901234567890123456789012',
    },
  },
};
