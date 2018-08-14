const config = require('@lvconnect/config/server');
const GithubApi = require('github');

exports.name = 'githubOrgUserLink';

exports.initWorker = server =>
  (job, done) => {
    const { user } = job.data;
    const { githubHandle } = user;
    const { User } = server.plugins.users.models;

    if (!githubHandle || !githubHandle.length || !config.github.apiToken || !config.github.org) {
      return done();
    }

    server.log('worker', `Task ${exports.name}: GitHub user add to org starting`);

    const github = new GithubApi();
    github.authenticate({
      type: 'token',
      token: config.github.apiToken,
    });

    return User.update({ _id: user._id }, { $set: { 'thirdParty.github': 'pending' } })
      .then(() => github.orgs.addOrgMembership({
        org: config.github.org,
        username: githubHandle,
        role: 'member',
      }))
      .then(() => {
        server.log('worker', `Task ${exports.name}: ${githubHandle} GitHub user added to org`);

        return User.update({ _id: user._id }, { $set: { 'thirdParty.github': 'success' } });
      })
      .catch((err) => {
        server.log('worker', `Task ${exports.name} : Failed with error \n ${err}`);

        return User.update({ _id: user._id }, { $set: { 'thirdParty.github': 'error' } });
      })
      .then(() => done())
      .catch(done);
  };
