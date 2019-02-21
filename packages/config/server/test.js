module.exports = {
  server: {
    cache: {
      name: 'redisCache',
      engine: 'catbox-memory',
    },
  },
  login: {
    cookie: {
      secret: '12345678901234567890123456789012',
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
    },
  },
};
