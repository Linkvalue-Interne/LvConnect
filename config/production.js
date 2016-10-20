module.exports = {
  host: {
    hostname: 'lvconnect.link-value.fr',
    port: 8000,
  },
  logs: {
    reporters: {
      accessReporting: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*', response: '*' }],
      }, {
        module: 'good-squeeze',
        name: 'SafeJson',
      }, {
        module: 'good-file',
        args: ['./logs/hapi/hapi-out.log'],
      }],
      errorReporting: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ error: '*' }],
      }, {
        module: 'good-squeeze',
        name: 'SafeJson',
      }, {
        module: 'good-file',
        args: ['./logs/hapi/hapi-error.log'],
      }],
    },
  },
};
