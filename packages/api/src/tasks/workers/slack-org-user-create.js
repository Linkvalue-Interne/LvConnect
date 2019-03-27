const config = require('@lvconnect/config/server');
const fetch = require('node-fetch');

exports.name = 'slackOrgUserCreate';

exports.initWorker = server => (job, done) => {
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
    .then(() => fetch('https://api.slack.com/scim/v1/Users', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${config.slack.apiToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
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
      }),
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
