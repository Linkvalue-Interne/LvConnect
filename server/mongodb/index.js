const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

exports.register = (server, { user, password, host, port, database, config }, next) => {
  const userPart = user ? `${user}:${password}@` : '';
  mongoose.connect(`mongodb://${userPart}${host}:${port}/${database}`, { config })
    .then(() => {
      server.expose('mongoose', mongoose);
      next();
    })
    .catch(next);
};

exports.register.attributes = {
  name: 'mongodb',
  version: '0.0.1',
};
