const { expect } = require('chai');

const userFixtures = require('../fixtures/users');
const testSetup = require('../setup');

const [fixAdminUser, fixTechUser] = userFixtures;

describe('/users/{id}', () => {
  describe('DELETE', () => {
    let server;
    let User;
    let savedUser;

    before(async function () {
      server = await testSetup();
      ({ User } = server.plugins.users.models);
    });

    after(() => server.stop());

    it('should delete a user', async function () {
      // Given
      savedUser = await User.create({ email: 'test@test.com' });
      const response = await server.inject({
        method: 'DELETE',
        url: `/users/${savedUser._id}`,
        credentials: {
          scopes: ['users:delete'],
          user: new User(fixAdminUser),
        },
        payload: {
          firstName: 'hello',
          lastName: 'world',
        },
      });
      const userCount = await User.count({});

      // Then
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.deep.equal({ deleted: true });
      expect(userCount).to.equal(userFixtures.length);
    });

    it('should reject if user has insufficient rights', async function () {
      // Given
      savedUser = await User.create({ email: 'test@test.com' });
      const response = await server.inject({
        method: 'DELETE',
        url: `/users/${savedUser._id}`,
        credentials: {
          scopes: ['users:delete'],
          user: new User(fixTechUser),
        },
        payload: {
          firstName: 'hello',
          lastName: 'world',
        },
      });
      const userCount = await User.count({});

      // Then
      expect(response.statusCode).to.equal(403);
      expect(userCount).to.equal(userFixtures.length + 1);
    });

    it('should reject if scope is missing', async function () {
      // Given
      savedUser = await User.create({ email: 'test@test.com' });
      const response = await server.inject({
        method: 'DELETE',
        url: `/users/${savedUser._id}`,
        credentials: {
          scopes: [],
          user: new User(fixTechUser),
        },
        payload: {
          firstName: 'hello',
          lastName: 'world',
        },
      });

      // Then
      expect(response.statusCode).to.equal(403);
    });
  });
});
