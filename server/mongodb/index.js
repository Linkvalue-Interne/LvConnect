const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

function mongodbSerializer(value, omit) {
  if (Array.isArray(value)) {
    return value.map(v => mongodbSerializer(v, omit));
  }

  const omitted = omit.reduce((map, key) => Object.assign(map, { [key]: undefined }), {});

  return Object.assign(value.toJSON(), omitted, {
    _id: undefined,
    __v: undefined,
    id: value._id,
  });
}

function mongodbReply(value, omit = []) {
  if (value instanceof Promise) {
    return this.response(value.then(payload => mongodbSerializer(payload, omit)));
  }
  return this.response(mongodbSerializer(value, omit));
}

exports.register = (server, { user, password, host, port, database, config }, next) => {
  server.decorate('reply', 'mongodb', mongodbReply);

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
