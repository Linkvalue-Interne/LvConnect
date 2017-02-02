const { expect } = require('chai');
const testSetup = require('../setup');

describe('/login', () => {
  describe('GET', () => {
    let server;
    before(async function () {
      server = await testSetup();
    });

    after(() => server.stop());

    it('should return login page', async function () {
      // When
      const response = await server.inject({
        method: 'GET',
        url: '/login',
      });

      // Then
      expect(response.statusCode).to.equal(200);
    });

    it('should redirect to dashboard if already logged in', async function () {
      // When
      const response = await server.inject({
        method: 'GET',
        url: '/login',
        credentials: { foo: 'bar' },
      });

      // Then
      expect(response.statusCode).to.equal(302);
      expect(response.headers.location).to.equal('/dashboard');
    });
  });
});
