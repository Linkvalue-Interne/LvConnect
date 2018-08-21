const { expect } = require('chai');
const testSetup = require('../setup');

describe('/old/login', () => {
  describe('GET', () => {
    let server;
    before(async () => {
      server = await testSetup();
    });

    after(() => server.stop());

    it('should return login page', async () => {
      // When
      const response = await server.inject({
        method: 'GET',
        url: '/old/login',
      });

      // Then
      expect(response.statusCode).to.equal(200);
    });

    it('should redirect to dashboard if already logged in', async () => {
      // When
      const response = await server.inject({
        method: 'GET',
        url: '/old/login',
        credentials: { foo: 'bar' },
      });

      // Then
      expect(response.statusCode).to.equal(302);
      expect(response.headers.location).to.equal('/old/dashboard');
    });
  });
});
