module.exports = {
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
};
