module.exports = {
  server: {},
  host: {
    port: 8000,
  },
  logs: {
    reporters: {
      consoleReporter: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*', response: '*', error: '*', worker: '*' }],
      }, {
        module: 'good-console',
        args: [{ colors: true }],
      }, 'stdout'],
    },
  },
  oauth: {
    accessTokenTTL: 'P2D',
    refreshTokenTTL: 'P1M',
    authorizationCodeTTL: 'PT10M',
  },
  csrf: {
    skip: req => !/(\/oauth\/authorize|\/dashboard|\/old\/login|\/login|\/forgot-password)/.test(req.path),
    cookieOptions: {
      isSecure: false,
    },
  },
  login: {
    cache: {
      listsTTL: 30 * 24 * 60 * 60 * 1000,
      sessionsTTL: 3 * 24 * 60 * 60 * 1000,
      passwordResetTTL: 60 * 60 * 1000,
    },
    cookie: {
      secret: process.env.COOKIE_SECRET,
      name: 'lvconnect',
      redirect: '/login',
      isSecure: false,
      isSameSite: 'Lax',
    },
  },
  trello: {},
  github: {},
  slack: {},
  mailjet: {
    apiKey: process.env.MAILJET_API_KEY,
    apiToken: process.env.MAILJET_API_TOKEN,
    baseUrl: 'http://localhost:8000',
  },
  monitoring: {
    metricsPath: '/metrics',
  },
};
