module.exports = {
  host: {
    hostname: '0.0.0.0',
    port: 8000,
  },
  server: {
    cache: {
      name: 'redisCache',
      engine: 'catbox-redis',
      host: 'cache',
      port: 6379,
      database: 0,
      partition: 'lvc-cache',
    },
    cors: {
      origin: ['http://localhost:8000', 'http://localhost:8080'],
    },
  },
  mongodb: {
    url: 'mongodb://db:27017/lvconnect',
  },
  kue: {
    redis: {
      host: 'cache',
      port: 6379,
      db: 0,
    },
    prefix: 'lvc-kue',
    config: {
      shutdownTimeout: 5000,
    },
  },
};
