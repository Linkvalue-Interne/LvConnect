const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

function mongodbSerializer(value, omit) {
  if (!value) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(v => mongodbSerializer(v, omit));
  }

  if (value.results && Array.isArray(value.results)) {
    return Object.assign({}, value, { results: value.results.map(v => mongodbSerializer(v, omit)) });
  }

  let payload = value;
  if (value.toJSON) {
    payload = Object.assign(value.toJSON(), {
      id: value._id.toString(),
    });
  }

  omit.concat(['_id', '__v']).forEach((key) => {
    delete payload[key];
  });

  return payload;
}

async function mongodbReply(value, omit = []) {
  const payload = await Promise.resolve(value);
  return this.response(mongodbSerializer(payload, omit));
}

module.exports = {
  name: 'mongodb',
  async register(server, { url }) {
    server.decorate('toolkit', 'mongodb', mongodbReply);

    await mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true });
    server.log('info', `Database connected to: ${url}`);
    server.expose('mongoose', mongoose);
  },
};
