const config = require('config');
const ovh = require('ovh')(config.ovh);

exports.name = 'createThirdPartyAccounts';

exports.initWorker = (server) => {
  server.log('info', `Init task ${exports.name}`);

  return (job, done) => {
    const { email, plainPassword } = job.data;

    const [, username, domain, ext] = email.match(/^(.+)@(.+)\.(\w+)$/i);

    ovh.requestPromised('POST', `/email/domain/${domain}.${ext}/account`, {
      accountName: username,
      password: plainPassword,
    })
      .then(() => {
        server.log('info', `Task ${exports.name} : ${email} OVH account created`);
        done();
      })
      .catch(done);
  };
};
