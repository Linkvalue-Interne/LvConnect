module.exports = {
  host: {
    hostname: 'localhost',
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
  csrf: {
    skip: () => true,
    cookieOptions: {
      isSecure: false,
    },
  },
};
