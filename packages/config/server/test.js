module.exports = {
  server: {
    cache: {
      name: 'redisCache',
      engine: 'catbox-memory',
    },
  },
  mongodb: {
    url: 'mongodb://mongo:27017/lvconnect_test',
  },
  kue: {
    redis: {
      host: 'localhost',
      port: 6379,
      db: 0,
    },
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
