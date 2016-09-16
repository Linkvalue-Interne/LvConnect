const createServer = require('../server');
const fixtures = require('./fixtures');

function dropDatabase(server) {
  const { mongoose } = server.plugins.mongodb;
  return new Promise(resolve => mongoose.connection.db.dropDatabase({}, resolve));
}

function loadFixtures(server) {
  const { mongoose } = server.plugins.mongodb;
  const promises = Object.keys(fixtures)
    .map(key => mongoose.model(key).create(fixtures[key]));
  return Promise.all(promises);
}

module.exports = async function testSetup(options) {
  const server = await createServer();

  return await dropDatabase(server)
    .then(() => loadFixtures(server))
    .then(() => server.inject(options));
};
