const createThirdPartyAccounts = require('./create-third-party-accounts');

exports.register = (server, options, next) => {
  const tasks = [
    createThirdPartyAccounts,
  ];

  const { queue } = server.plugins.kue;

  tasks.forEach(({ name, initWorker }) => {
    const worker = initWorker(server);

    queue.process(name, worker);
    server.expose(name, params => queue.create(name, params));
  });

  next();
};

exports.register.attributes = {
  name: 'tasks',
  version: '0.0.1',
  dependencies: ['kue'],
};
