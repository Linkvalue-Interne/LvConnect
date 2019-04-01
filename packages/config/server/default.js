module.exports = {
  server: {},
  host: {
    port: 8000,
  },
  oauth: {
    accessTokenTTL: 'P2D',
    refreshTokenTTL: 'P1M',
    authorizationCodeTTL: 'PT10M',
  },
  csrf: {
    skip: req => !/(\/oauth\/authorize|\/login|\/forgot-password|\/reset-password)/.test(req.path),
    restful: true,
    cookieOptions: {
      isSecure: true,
      clearInvalid: true,
      ignoreErrors: true,
      encoding: 'iron',
      password: process.env.COOKIE_SECRET,
    },
  },
  login: {
    cache: {
      passwordResetSecret: process.env.COOKIE_SECRET,
      passwordResetTTL: 60 * 60 * 1000,
    },
  },
  trello: {},
  github: {},
  slack: {},
  mailjet: {
    send: true,
    preview: false,
    apiKey: process.env.MAILJET_API_KEY,
    apiToken: process.env.MAILJET_API_TOKEN,
    fromName: 'LVConnect',
    fromEmail: 'no-reply@link-value.fr',
    baseUrl: 'http://localhost:8000',
  },
};
