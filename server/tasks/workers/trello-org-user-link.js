const config = require('config');
const TrelloApi = require('node-trello');

exports.name = 'trelloOrgUserLink';

exports.initWorker = server =>
  (job, done) => {
    const { user } = job.data;
    const { trelloHandle } = user;
    const { User } = server.plugins.users.models;

    if (!trelloHandle || !trelloHandle.length) {
      return done();
    }

    server.log('worker', `Task ${exports.name}: Trello user add to org/boards starting`);

    const trello = new TrelloApi(config.trello.apiKey, config.trello.apiToken);

    return User.update({ _id: user._id }, { $set: { 'thirdParty.trello': 'pending' } })
      .then(() => new Promise((resolve, reject) => {
        trello.put(`/1/organizations/${config.trello.org}/members/${trelloHandle}`, {
          type: 'normal',
        }, (err, res) => {
          if (err) {
            return reject(err);
          }

          server.log('worker', `Task ${exports.name}: ${trelloHandle} Trello user added to org`);
          return resolve(res);
        });
      }))
      .then(() => config.trello.boards.map(boardId => new Promise((resolve, reject) => {
        trello.put(`/1/boards/${boardId}/members/${trelloHandle}`, {
          type: 'normal',
        }, (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res);
        });
      })))
      .then(Promise.all.bind(Promise))
      .then(() => {
        server.log('worker', `Task ${exports.name}: ${trelloHandle} Trello user added to boards`);

        return User.update({ _id: user._id }, { $set: { 'thirdParty.trello': 'success' } });
      })
      .catch((err) => {
        server.log('worker', `Task ${exports.name} : Failed with error \n ${err}`);

        return User.update({ _id: user._id }, { $set: { 'thirdParty.github': 'error' } });
      })
      .then(() => done())
      .catch(done);
  };
