const config = require('config');
const request = require('request-promise');

exports.name = 'slackOrgUserCreate';

exports.initWorker = server =>
  (job, done) => {
    if (!config.slack.apiToken) {
      done();
    }

    const { User } = server.plugins.users.models;
    const { user } = job.data;
    const {
      firstName,
      lastName,
      email,
      slackHandle,
      profilePictureUrl,
    } = user;

    server.log('worker', `Task ${exports.name}: Slack user add create`);

    return User.update({ _id: user._id }, { $set: { 'thirdParty.slack': 'pending' } })
      .then(() => request({
        baseUrl: 'https://api.slack.com/scim/v1/',
        uri: '/Users',
        method: 'POST',
        json: true,
        auth: {
          bearer: config.slack.apiToken,
        },
        body: {
          userName: slackHandle || (firstName.substr(0, 1) + lastName).toLowerCase(),
          name: {
            givenName: firstName,
            familyName: lastName,
          },
          photos: [{
            value: profilePictureUrl,
            type: 'photo',
          }],
          emails: [{
            value: email,
            primary: true,
          }],
        },
      }))
      .then(() => {
        server.log('worker', `Task ${exports.name}: Slack user created`);

        return User.update({ _id: user._id }, { $set: { 'thirdParty.slack': 'success' } });
      })
      .catch((err) => {
        server.log('worker', `Task ${exports.name} : Failed with error \n ${err}`);

        return User.update({ _id: user._id }, { $set: { 'thirdParty.slack': 'error' } });
      })
      .then(() => done())
      .catch(done);
  };
