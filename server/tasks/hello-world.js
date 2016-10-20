exports.name = 'helloWorld';

exports.initWorker = (server) => {
  server.log('info', `Init task ${exports.name}`);

  return (job, done) => {
    server.log('info', `${exports.name} task processed`);
    done();
  };
};
