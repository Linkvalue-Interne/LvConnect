const { expect } = require('chai');

const [fixAdminUser, fixTechUser] = require('../fixtures/users');
const testSetup = require('../setup');

describe('/users', () => {
  describe('GET', () => {
    let server;
    let User;
    before(async function () {
      server = await testSetup();
      ({ User } = server.plugins.users.models);
    });

    after(() => server.stop());

    it('should return list of users', async function () {
      // Given
      const response = await server.inject({
        method: 'GET',
        url: '/users',
        credentials: {
          scopes: ['users:get'],
          user: new User(fixAdminUser),
        },
      });

      // Then
      const [result] = response.result.results;
      expect(response.statusCode).to.equal(200);
      expect(result.lastName).to.equal(fixAdminUser.lastName);
      expect(result.firstName).to.equal(fixAdminUser.firstName);
      expect(result.email).to.equal(fixAdminUser.email);
      expect(result.createdAt.toString()).to.equal(fixAdminUser.createdAt.toString());
    });

    it('should handle pagination', async function () {
      // Given
      const response = await server.inject({
        method: 'GET',
        url: '/users?limit=1&page=2',
        credentials: {
          scopes: ['users:get'],
          user: new User(fixAdminUser),
        },
      });

      // Then
      const [result] = response.result.results;
      expect(response.statusCode).to.equal(200);
      expect(result.lastName).to.equal(fixTechUser.lastName);
      expect(result.firstName).to.equal(fixTechUser.firstName);
      expect(result.email).to.equal(fixTechUser.email);
      expect(result.createdAt.toString()).to.equal(fixTechUser.createdAt.toString());
    });

    it('should filter by email', async function () {
      // Given
      const response = await server.inject({
        method: 'GET',
        url: '/users?email=baz@qux.com',
        credentials: {
          scopes: ['users:get'],
          user: new User(fixAdminUser),
        },
      });

      // Then
      const [result] = response.result.results;
      expect(response.statusCode).to.equal(200);
      expect(result.lastName).to.equal(fixTechUser.lastName);
      expect(result.firstName).to.equal(fixTechUser.firstName);
      expect(result.email).to.equal(fixTechUser.email);
      expect(result.createdAt.toString()).to.equal(fixTechUser.createdAt.toString());
    });

    it('should fail if scope is missing', async function () {
      // Given
      const response = await server.inject({
        method: 'GET',
        url: '/users?email=baz@qux.com',
        credentials: {
          scopes: [],
          user: new User(fixAdminUser),
        },
      });

      // Then
      expect(response.statusCode).to.equal(403);
    });
  });
});
