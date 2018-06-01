const { expect } = require('chai');

const [fixAdminUser, fixTechUser] = require('../fixtures/users');
const testSetup = require('../setup');
const { TECH, HR } = require('../../src/roles');

describe('/users/{id}', () => {
  describe('PUT', () => {
    let server;
    let User;
    let savedUser;

    before(async function () {
      server = await testSetup();
      ({ User } = server.plugins.users.models);
    });

    after(() => server.stop());

    it('should edit an user', async function () {
      // Given
      savedUser = await User.findOne({ email: fixAdminUser.email }).exec();
      const response = await server.inject({
        method: 'PUT',
        url: `/users/${savedUser._id}`,
        credentials: {
          scopes: ['users:modify'],
          user: new User(fixAdminUser),
        },
        payload: {
          firstName: 'hello',
          lastName: 'world',
          roles: [TECH, HR],
          city: 'Paris',
        },
      });

      // Then
      expect(response.statusCode).to.equal(200);
      expect(response.result.firstName).to.equal('hello');
      expect(response.result.lastName).to.equal('world');
      expect(response.result.email).to.equal('foo@bar.com');
      expect(response.result.createdAt).to.be.a('date');
      expect(response.result.roles).to.deep.equal([TECH, HR]);
      expect(response.result.city).to.equal('Paris');
    });

    it('should reject if user has insufficient rights', async function () {
      // Given
      savedUser = await User.findOne({ email: fixAdminUser.email }).exec();
      const response = await server.inject({
        method: 'PUT',
        url: `/users/${savedUser._id}`,
        credentials: {
          scopes: ['users:modify'],
          user: new User(fixTechUser),
        },
        payload: {
          firstName: 'hello',
          lastName: 'world',
          roles: [TECH, HR],
        },
      });

      // Then
      expect(response.statusCode).to.equal(403);
    });

    it('should not fail for insufficient rights if editing self', async function () {
      // Given
      savedUser = await User.findOne({ email: fixTechUser.email }).exec();
      const response = await server.inject({
        method: 'PUT',
        url: `/users/${savedUser._id}`,
        credentials: {
          scopes: ['profile:modify'],
          user: savedUser,
        },
        payload: {
          firstName: 'hello',
          lastName: 'world',
        },
      });

      // Then
      expect(response.statusCode).to.equal(200);
    });

    it('should reject if no rights, editing self and changing roles', async function () {
      // Given
      savedUser = await User.findOne({ email: fixTechUser.email }).exec();
      const response = await server.inject({
        method: 'PUT',
        url: `/users/${savedUser._id}`,
        credentials: {
          scopes: ['profile:modify'],
          user: savedUser,
        },
        payload: {
          firstName: 'hello',
          lastName: 'world',
          roles: [TECH],
        },
      });

      // Then
      expect(response.statusCode).to.equal(403);
    });
  });
});
