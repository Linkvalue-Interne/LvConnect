module.exports = {
  host: {
    port: 8080,
  },
  server: {
    cache: {
      name: 'redisCache',
      engine: 'catbox-memory',
    },
  },
  mongodb: {
    host: 'localhost',
    port: 27017,
    database: 'lvconnect_test',
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
