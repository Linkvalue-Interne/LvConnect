module.exports = {
  mongodb: {
    host: 'localhost',
    port: 27017,
    database: 'lvconnect',
  },
  kue: {
    host: 'localhost',
    port: 6379,
    db: 0,
    prefix: 'lvc-kue:',
    config: {
      shutdownTimeout: 5000,
    },
  },
  oauth: {
    accessTokenTTL: '2D',
    refreshTokenTTL: '2W',
  },
  login: {
    cache: {
      ttl: 3 * 24 * 60 * 60 * 1000,
    },
    cookie: {
      secret: '12345678901234567890123456789012',
      name: 'lvconnect',
      redirect: '/login',
      isSecure: false,
    },
  },
};
