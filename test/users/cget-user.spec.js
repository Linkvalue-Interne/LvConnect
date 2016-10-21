const { expect } = require('chai');

const fixUser = require('../fixtures/users')[0];
const fixApp = require('../fixtures/applications')[0];
const testSetup = require('../setup');

describe('/users', () => {
  describe('GET', () => {
    let server;
    let Application;
    before(async function () {
      server = await testSetup();
      Application = server.plugins.oauth.models.Application;
    });

    after(() => server.stop());

    it('should return list of users', async function () {
      // Given
      const response = await server.inject({
        method: 'GET',
        url: '/users',
        credentials: new Application(fixApp),
      });

      // Then
      expect(response.statusCode).to.equal(200);
      expect(response.result[0].lastName).to.equal(fixUser.lastName);
      expect(response.result[0].firstName).to.equal(fixUser.firstName);
      expect(response.result[0].email).to.equal(fixUser.email);
      expect(response.result[0].createdAt.toString()).to.equal(fixUser.createdAt.toString());
    });
  });
});
