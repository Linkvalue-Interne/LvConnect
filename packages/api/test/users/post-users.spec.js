const { expect } = require('chai');
const { roles } = require('@lvconnect/config');

const [fixAdminUser, fixTechUser] = require('../fixtures/users');
const testSetup = require('../setup');

describe('/users', () => {
  describe('POST', () => {
    let server;
    let User;
    before(async () => {
      server = await testSetup();
      ({ User } = server.plugins.users.models);
    });

    after(() => server.stop());

    it('should create a user', async () => {
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
          roles: [roles.TECH],
          city: 'Lyon',
        },
      });

      // Then
      expect(response.statusCode).to.equal(200);
      expect(response.result.lastName).to.equal(fixAdminUser.lastName.toUpperCase());
      expect(response.result.firstName).to.equal(fixAdminUser.firstName);
      expect(response.result.email).to.equal(fixAdminUser.email);
      expect(response.result.createdAt).to.be.a('date');
      expect(response.result.roles).to.deep.equal([roles.TECH]);
    });

    it('should reject if user has insufficient rights', async () => {
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
          roles: [roles.TECH],
          city: 'Lyon',
        },
      });

      // Then
      expect(response.statusCode).to.equal(403);
    });
  });
});
