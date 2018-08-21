const { expect } = require('chai');
const { roles } = require('@lvconnect/config');

const [fixAdminUser, fixTechUser] = require('../fixtures/users');
const testSetup = require('../setup');

describe('/users/{id}', () => {
  describe('PUT', () => {
    let server;
    let User;
    let savedUser;

    before(async () => {
      server = await testSetup();
      ({ User } = server.plugins.users.models);
    });

    after(() => server.stop());

    it('should edit an user', async () => {
      // Given
      savedUser = await User.findOne({ email: fixAdminUser.email }).exec();
      expect(savedUser.profilePictureUrl)
        .to.equal('https://www.gravatar.com/avatar/f3ada405ce890b6f8204094deb12d8a8?s=200');

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
          roles: [roles.TECH, roles.HR],
          city: 'Paris',
          phone: '0134.212.000',
        },
      });

      // Then
      expect(response.statusCode).to.equal(200);
      expect(response.result.firstName).to.equal('hello');
      expect(response.result.lastName).to.equal('WORLD');
      expect(response.result.email).to.equal('foo@bar.com');
      expect(response.result.createdAt).to.be.a('date');
      expect(response.result.roles).to.deep.equal([roles.TECH, roles.HR]);
      expect(response.result.city).to.equal('Paris');
      expect(response.result.phone).to.equal('+33 1 34 21 20 00');
      expect(response.result.profilePictureUrl)
        .to.equal('https://www.gravatar.com/avatar/f3ada405ce890b6f8204094deb12d8a8?s=200');
    });

    it('should reject if not passing validation', async () => {
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
          phone: '34.212.000',
        },
      });

      // Then
      expect(response.statusCode).to.equal(400);
      expect(response.result.message)
        .to.equal('child "phone" fails because ["phone" needs to be a proper french phone number]');
    });

    it('should reject if user has insufficient rights', async () => {
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
          roles: [roles.TECH, roles.HR],
        },
      });

      // Then
      expect(response.statusCode).to.equal(403);
    });

    it('should not fail for insufficient rights if editing self', async () => {
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

    it('should reject if no rights, editing self and changing roles', async () => {
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
          roles: [roles.TECH],
        },
      });

      // Then
      expect(response.statusCode).to.equal(403);
    });
  });
});
