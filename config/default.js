module.exports = {
  server: {},
  host: {
    hostname: 'localhost',
    port: 8000,
  },
  logs: {
    reporters: {
      consoleReporter: [{
        module: 'good-console',
        args: [{ log: '*', response: '*', worker: '*' }],
      }, 'stdout'],
    },
  },
  mongodb: {
    host: 'localhost',
    port: 27017,
    database: 'lvconnect',
  },
  kue: {
    host: 'localhost',
    port: 6379,
    db: 0,
    prefix: 'lvc-kue',
    config: {
      shutdownTimeout: 5000,
    },
  },
  ovh: {
    endpoint: '',
    appKey: '',
    appSecret: '',
    consumerKey: '',
  },
  oauth: {
    accessTokenTTL: 'P2D',
    refreshTokenTTL: 'P2W',
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
