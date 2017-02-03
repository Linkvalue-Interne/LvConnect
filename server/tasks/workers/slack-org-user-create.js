const config = require('config');
const request = require('request-promise');

exports.name = 'slackOrgUserCreate';

exports.initWorker = server =>
  (job, done) => {
    const { user } = job.data;
    const {
      firstName,
      lastName,
      email,
      fallbackEmail,
      slackHandle,
      profilePictureUrl,
    } = user;

    server.log('worker', `Task ${exports.name}: Slack user add create`);

    user.thirdParty.slack = 'pending';
    return user.save()
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
          }, {
            value: fallbackEmail,
          }],
        },
      }))
      .then(() => {
        server.log('worker', `Task ${exports.name}: Slack user created`);

        user.thirdParty.slack = 'success';
        return user.save();
      })
      .catch((err) => {
        server.log('worker', `Task ${exports.name} : Failed with error \n ${err}`);

        user.thirdParty.slack = 'error';
        return user.save();
      })
      .then(() => done())
      .catch(done);
  };
