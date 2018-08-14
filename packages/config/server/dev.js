module.exports = {
  host: {
    hostname: 'localhost',
  },
  server: {
    cache: {
      name: 'redisCache',
      engine: 'catbox-redis',
      host: 'localhost',
      port: 6379,
      database: 0,
      partition: 'lvc-cache',
    },
  },
  mongodb: {
    url: 'mongodb://localhost:27017/lvconnect',
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
};
