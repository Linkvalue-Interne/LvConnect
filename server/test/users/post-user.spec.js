const { expect } = require('chai');

const [fixAdminUser, fixTechUser] = require('../fixtures/users');
const testSetup = require('../setup');
const { TECH } = require('../../src/roles');

describe('/users', () => {
  describe('POST', () => {
    let server;
    let User;
    before(async function () {
      server = await testSetup();
      ({ User } = server.plugins.users.models);
    });

    after(() => server.stop());

    it('should create a user', async function () {
      // Given
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        credentials: {
          scopes: ['users:create'],
          user: new User(fixAdminUser),
        },
        payload: {
          firstName: fixAdminUser.firstName,
          lastName: fixAdminUser.lastName,
          email: fixAdminUser.email,
          plainPassword: 'admin1234',
          roles: [TECH],
          city: 'Lyon',
        },
      });

      // Then
      expect(response.statusCode).to.equal(201);
      expect(response.result.lastName).to.equal(fixAdminUser.lastName.toUpperCase());
      expect(response.result.firstName).to.equal(fixAdminUser.firstName);
      expect(response.result.email).to.equal(fixAdminUser.email);
      expect(response.result.createdAt).to.be.a('date');
      expect(response.result.roles).to.deep.equal([TECH]);
    });

    it('should reject if user has insufficient rights', async function () {
      // Given
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        credentials: {
          scopes: ['users:create'],
          user: new User(fixTechUser),
        },
        payload: {
          firstName: fixAdminUser.firstName,
          lastName: fixAdminUser.lastName,
          email: fixAdminUser.email,
          plainPassword: 'admin1234',
          roles: [TECH],
          city: 'Lyon',
        },
      });

      // Then
      expect(response.statusCode).to.equal(403);
    });
  });
});
