module.exports = {
  server: {},
  host: {
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
  ovh: {
    endpoint: '',
    appKey: '',
    appSecret: '',
    consumerKey: '',
  },
  oauth: {
    accessTokenTTL: 'P2D',
    refreshTokenTTL: 'P2W',
    authorizationCodeTTL: 'PT10M',
  },
  csrf: {
    skip: req => !/(\/oauth\/authorize|\/dashboard|\/login)/.test(req.path),
    cookieOptions: {
      isSecure: false,
    },
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
  trello: {
    org: '5894626eefa015d31c4550bc',
    boards: ['589462b539075913888623ec'],
  },
  github: {
    org: 'lvtestorg',
  },
  slack: {},
};
