const { expect } = require('chai');
const { noop } = require('lodash');

const [fixUser] = require('../fixtures/users');
const trelloWorker = require('../../server/tasks/workers/trello-org-user-link');
const testSetup = require('../setup');

describe('Trello user onboarding', () => {
  let server;
  let User;

  before(async function () {
    server = await testSetup();
    User = server.plugins.users.models.User;
  });

  after(() => server.stop());

  it('should add user to Trello boards', async function () {
    // When
    await trelloWorker.initWorker(console)({ data: { user: new User(fixUser) } }, noop);

    // Then
    expect(fixUser.thirdParty.trello).to.equal('success');
  });
});
