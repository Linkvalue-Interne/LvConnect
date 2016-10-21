const { expect } = require('chai');
const createServer = require('../../server');

describe('/login', () => {
  describe('GET', () => {
    it('should return login page', async function () {
      // Given
      const server = await createServer();
      const response = await server.inject({
        method: 'GET',
        url: '/login',
      });

      // Then
      expect(response.statusCode).to.equal(200);

      server.stop();
    });
  });
});
