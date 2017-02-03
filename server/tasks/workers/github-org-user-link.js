const config = require('config');
const GithubApi = require('github');

exports.name = 'githubOrgUserLink';

exports.initWorker = server =>
  (job, done) => {
    const { user } = job.data;
    const { githubHandle } = user;

    if (!githubHandle || !githubHandle.length) {
      return done();
    }

    server.log('worker', `Task ${exports.name}: GitHub user add to org starting`);

    const github = new GithubApi();
    github.authenticate({
      type: 'token',
      token: config.github.apiToken,
    });

    user.thirdParty.github = 'pending';
    return user.save()
      .then(() => github.orgs.addOrgMembership({
        org: config.github.org,
        username: githubHandle,
        role: 'member',
      }))
      .then(() => {
        server.log('worker', `Task ${exports.name}: ${githubHandle} GitHub user added to org`);

        user.thirdParty.github = 'success';
        return user.save();
      })
      .catch((err) => {
        server.log('worker', `Task ${exports.name} : Failed with error \n ${err}`);

        user.thirdParty.github = 'error';
        return user.save();
      })
      .then(() => done())
      .catch(done);
  };
