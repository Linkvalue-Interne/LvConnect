const { expect } = require('chai');

const fixUser = require('../fixtures/users')[0];
const fixApp = require('../fixtures/applications')[0];
const testSetup = require('../setup');

describe('/oauth/token', () => {
  describe('POST', () => {
    let server;
    let Application;
    before(async () => {
      server = await testSetup();
      ({ Application } = server.plugins.apps.models);
    });

    after(() => server.stop());

    it('should work with grant password', async () => {
      // Given
      const response = await server.inject({
        method: 'POST',
        url: '/oauth/token',
        payload: {
          grant_type: 'password',
          username: fixUser.email,
          password: 'password',
          scope: ['users:get'],
        },
        credentials: new Application(fixApp),
      });

      // Then
      expect(response.statusCode).to.equal(201);
      expect(response.result.access_token).to.be.a('string');
      expect(response.result.refresh_token).to.be.a('string');
      expect(response.result.scope).to.deep.equal(['users:get']);
    });
  });
});
