const config = require('config');
const ovh = require('ovh')(config.ovh);

exports.name = 'createOVHAccount';

exports.initWorker = server =>
  (job, done) => {
    const { email, plainPassword, user } = job.data;

    server.log('worker', `Task ${exports.name} : Start creating OVH account for ${email}`);

    const [, accountName, domain, ext] = email.match(/^(.+)@(.+)\.(\w+)$/i);

    server.plugins.users.models.User
      .update({ _id: user._id }, {
        $set: {
          thirdParty: Object.assign({}, user.thirdParty, { ovh: 'pending' }),
        },
      })
      .exec()
      .then(() => ovh.requestPromised('POST', `/email/domain/${domain}.${ext}/account`, {
        accountName,
        password: plainPassword,
      }))
      .then(() => {
        server.log('worker', `Task ${exports.name} : ${email} OVH account created`);

        user.thirdParty.ovh = 'success';
        return user.save();
      })
      .catch((err) => {
        server.log('worker', `Task ${exports.name} : Failed with error \n ${err}`);

        user.thirdParty.ovh = 'error';
        return user.save();
      })
      .then(() => done())
      .catch(done);
  };
