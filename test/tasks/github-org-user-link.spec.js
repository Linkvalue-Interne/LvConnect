const { expect } = require('chai');
const { noop } = require('lodash');

const [fixUser] = require('../fixtures/users');
const githubWorker = require('../../server/tasks/workers/github-org-user-link');
const testSetup = require('../setup');

describe('Github user onboarding', () => {
  let server;
  let User;

  before(async function () {
    server = await testSetup();
    User = server.plugins.users.models.User;
  });

  after(() => server.stop());

  it('should add user to Github org', async function () {
    // When
    await githubWorker.initWorker(console)({ data: { user: new User(fixUser) } }, noop);

    // Then
    expect(fixUser.thirdParty.github).to.equal('success');
  });
});
