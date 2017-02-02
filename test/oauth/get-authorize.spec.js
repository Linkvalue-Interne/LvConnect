const { expect } = require('chai');

const [fixUser] = require('../fixtures/users');
const [fixApp] = require('../fixtures/applications');
const testSetup = require('../setup');

describe('/oauth/authorize', () => {
  let server;
  let User;
  before(async function () {
    server = await testSetup();
    User = server.plugins.users.models.User;
  });

  after(() => server.stop());

  describe('GET', () => {
    it('should return login page if not logged in', async function () {
      // When
      const response = await server.inject({
        method: 'GET',
        url: `/oauth/authorize?app_id=${fixApp.appId}&redirect_uri=http://localhost/redirect`,
      });

      // Then
      expect(response.statusCode).to.equal(200);
      expect(response.payload).to.contain('Login - LvConnect');
    });

    it('should return permissions page if logged in', async function () {
      // When
      const response = await server.inject({
        method: 'GET',
        url: `/oauth/authorize?app_id=${fixApp.appId}&redirect_uri=http://localhost/redirect`,
        credentials: new User(fixUser),
      });

      // Then
      expect(response.statusCode).to.equal(200);
      expect(response.payload).to.contain('Test App - LvConnect');
    });

    it('should redirect if already authorized', async function () {
      // Given
      const user = new User(fixUser);
      const application = await server.plugins.oauth.models.Application.findOne({});
      await server.plugins.oauth.models.Authorization.create({
        user,
        application,
        allowedScopes: ['users:get'],
      });

      // When
      const response = await server.inject({
        method: 'GET',
        url: `/oauth/authorize?app_id=${fixApp.appId}&redirect_uri=${fixApp.redirectUris[0]}`,
        credentials: user,
      });

      // Then
      expect(response.statusCode).to.equal(302);
      expect(response.headers.location).to.match(new RegExp(`^${fixApp.redirectUris[0]}\\?code=[a-z0-9]{40}$`));
    });
  });
});
