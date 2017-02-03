const config = require('config');
const TrelloApi = require('node-trello');

exports.name = 'trelloOrgUserLink';

exports.initWorker = server =>
  (job, done) => {
    const { user } = job.data;
    const { trelloHandle } = user;

    if (!trelloHandle || !trelloHandle.length) {
      return done();
    }

    server.log('worker', `Task ${exports.name}: Trello user add to org/boards starting`);

    const trello = new TrelloApi(
      config.trello.apiKey,
      config.trello.apiToken,
    );

    user.thirdParty.trello = 'pending';
    return user.save()
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

        user.thirdParty.trello = 'success';
        return user.save();
      })
      .catch((err) => {
        server.log('worker', `Task ${exports.name} : Failed with error \n ${err}`);

        user.thirdParty.trello = 'error';
        return user.save();
      })
      .then(() => done())
      .catch(done);
  };
