const CatboxMemory = require('@hapi/catbox-memory');

module.exports = {
  host: {
    hostname: 'localhost',
  },
  server: {
    cache: {
      name: 'redisCache',
      engine: new CatboxMemory({
        partition: 'lvc-cache',
      }),
    },
    cors: {
      origin: ['http://localhost:8000', 'http://localhost:8080'],
    },
  },
  login: {
    cache: {
      passwordResetSecret: 'hello',
    },
  },
  mongodb: {
    url: 'mongodb://localhost:27017/lvconnect_test',
  },
  kue: {
    redis: 'redis://localhost:6379/1',
    prefix: 'lvc-kue-test',
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
  mailjet: {
    send: false,
    preview: true,
    emailStore: {
      url: 'redis://localhost:6379/2',
      partition: 'lvconnect',
      segment: 'emails',
    },
  },
};
