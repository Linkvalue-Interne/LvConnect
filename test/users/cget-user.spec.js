const { expect } = require('chai');

const fixtures = require('../fixtures/users');
const testSetup = require('../setup');

describe('/users', () => {
  describe('GET', () => {
    it('should return list of users', async function () {
      // Given
      const response = await testSetup({
        method: 'GET',
        url: '/users',
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
