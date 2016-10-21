function reportingFactory(path, options) {
  return [{
    module: 'good-squeeze',
    name: 'Squeeze',
    args: [options],
  }, {
    module: 'good-squeeze',
    name: 'SafeJson',
  }, {
    module: 'good-file',
    args: [path],
  }];
}

module.exports = {
  host: {
    hostname: 'lvconnect.link-value.fr',
    port: 8000,
  },
  logs: {
    reporters: {
      accessReporting: reportingFactory('./logs/hapi/hapi-out.log', { log: '*', response: '*' }),
      errorReporting: reportingFactory('./logs/hapi/hapi-error.log', { error: '*' }),
      workerReporting: reportingFactory('./logs/hapi/hapi-worker.log', { worker: '*' }),
    },
  },
};
