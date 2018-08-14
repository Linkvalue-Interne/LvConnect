const { expect } = require('chai');
const { noop } = require('lodash');

const [fixUser] = require('../fixtures/users');
const trelloWorker = require('../../src/tasks/workers/trello-org-user-link');
const testSetup = require('../setup');

describe.skip('Trello user onboarding', () => {
  let server;
  let User;

  before(async () => {
    server = await testSetup();
    ({ User } = server.plugins.users.models);
  });

  after(() => server.stop());

  it('should add user to Trello boards', async () => {
    // When
    const user = await User.findOne({ email: fixUser.email });
    await trelloWorker.initWorker(server)({ data: { user } }, noop);

    // Then
    const editedUser = await User.findOne({ email: fixUser.email });
    expect(editedUser.thirdParty.trello).to.equal('success');
  });
});
