const { expect } = require('chai');

const [fixUser] = require('../fixtures/users');
const testSetup = require('../setup');

describe('/users/me', () => {
  describe('GET', () => {
    let server;
    let User;

    before(async function () {
      server = await testSetup();
      ({ User } = server.plugins.users.models);
    });

    after(() => server.stop());

    it('should return connected users', async function () {
      // Given
      const response = await server.inject({
        method: 'GET',
        url: '/users/me',
        credentials: {
          scopes: ['profile:get'],
          user: new User(fixUser),
        },
      });

      // Then
      expect(response.statusCode).to.equal(200);
      expect(response.result.lastName).to.equal(fixUser.lastName);
      expect(response.result.firstName).to.equal(fixUser.firstName);
      expect(response.result.email).to.equal(fixUser.email);
      expect(response.result.createdAt.toString()).to.equal(fixUser.createdAt.toString());
    });

    it('should reject if scope is missing', async function () {
      // Given
      const response = await server.inject({
        method: 'GET',
        url: '/users/me',
        credentials: {
          scopes: [],
          user: new User(fixUser),
        },
      });

      // Then
      expect(response.statusCode).to.equal(403);
    });
  });
});
