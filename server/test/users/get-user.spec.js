const { expect } = require('chai');

const [fixUser] = require('../fixtures/users');
const testSetup = require('../setup');

describe('/users/{id}', () => {
  describe('GET', () => {
    let server;
    let User;
    let savedUser;

    before(async function () {
      server = await testSetup();
      ({ User } = server.plugins.users.models);
      savedUser = await User.findOne({}).exec();
    });

    after(() => server.stop());

    it('should reject with 403 if getting user other than self with profile:get', async () => {
      // Given
      const request = {
        method: 'GET',
        url: `/users/${savedUser._id}`,
        credentials: {
          scopes: ['profile:get'],
          user: new User(fixUser),
        },
        payload: {
          firstName: 'hello',
          lastName: 'world',
        },
      };

      // When
      const response = await server.inject(request);

      // Then
      expect(response.statusCode).to.equal(403);
    });

    it('should return user by its id', async function () {
      // Given
      const response = await server.inject({
        method: 'GET',
        url: `/users/${savedUser._id}`,
        credentials: {
          scopes: ['users:get'],
          user: new User(fixUser),
        },
        payload: {
          firstName: 'hello',
          lastName: 'world',
        },
      });

      // Then
      expect(response.statusCode).to.equal(200);
      expect(response.result.lastName).to.equal(fixUser.lastName.toUpperCase());
      expect(response.result.firstName).to.equal(fixUser.firstName);
      expect(response.result.email).to.equal(fixUser.email);
      expect(response.result.createdAt.toString()).to.equal(fixUser.createdAt.toString());
    });

    it('should return user by its id, even if an user is not in credentials', async function () {
      // Given
      const response = await server.inject({
        method: 'GET',
        url: `/users/${savedUser._id}`,
        credentials: {
          scopes: ['users:get'],
        },
        payload: {
          firstName: 'hello',
          lastName: 'world',
        },
      });

      // Then
      expect(response.statusCode).to.equal(200);
      expect(response.result.lastName).to.equal(fixUser.lastName.toUpperCase());
      expect(response.result.firstName).to.equal(fixUser.firstName);
      expect(response.result.email).to.equal(fixUser.email);
      expect(response.result.createdAt.toString()).to.equal(fixUser.createdAt.toString());
    });
  });
});
