const { expect } = require('chai');

const fixtures = require('../fixtures/users');
const testSetup = require('../setup');

describe('/users', () => {
  describe('GET', () => {
    let server;
    before(async function () {
      server = await testSetup();
    });

    after(() => server.stop());

    it('should return list of users', async function () {
      // Given
      const response = await server.inject({
        method: 'GET',
        url: '/users',
        headers: {
          Authorization: 'Bearer foo-token',
        },
      });

      // Then
      expect(response.statusCode).to.equal(200);
      expect(response.result[0].lastName).to.equal(fixtures[0].lastName);
      expect(response.result[0].firstName).to.equal(fixtures[0].firstName);
      expect(response.result[0].email).to.equal(fixtures[0].email);
      expect(response.result[0].createdAt.toString()).to.equal(fixtures[0].createdAt.toString());
    });
  });
});
