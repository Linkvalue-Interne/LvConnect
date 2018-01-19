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

  describe('POST', () => {
    it('should return login page if invalid login', async function () {
      // When
      const response = await server.inject({
        method: 'POST',
        url: `/oauth/authorize?app_id=${fixApp.appId}&redirect_uri=${fixApp.redirectUris[0]}`,
        payload: {
          step: 'login',
          email: fixUser.email,
          password: 'invalid',
        },
      });

      // Then
      expect(response.statusCode).to.equal(200);
      expect(response.payload).to.contain('Login - LvConnect');
    });

    it('should return permissions page if valid login', async function () {
      // When
      const response = await server.inject({
        method: 'POST',
        url: `/oauth/authorize?client_id=${fixApp.appId}&redirect_uri=${fixApp.redirectUris[0]}`,
        payload: {
          step: 'login',
          email: fixUser.email,
          password: 'password',
        },
      });

      // Then
      expect(response.statusCode).to.equal(200);
      expect(response.payload).to.contain('Test App - LvConnect');
    });

    it('should redirect if authorized', async function () {
      // When
      const response = await server.inject({
        method: 'POST',
        url: `/oauth/authorize?app_id=${fixApp.appId}&redirect_uri=${fixApp.redirectUris[0]}`,
        credentials: new User(fixUser),
        payload: {
          step: 'permissions',
          scopes: fixApp.allowedScopes.join(','),
        },
      });

      // Then
      expect(response.statusCode).to.equal(302);
      expect(response.headers.location).to.match(new RegExp(`^${fixApp.redirectUris[0]}\\?code=[a-z0-9]{40}$`));
    });

    it('should return 403 if invalid redirect URI', async function () {
      // When
      const response = await server.inject({
        method: 'POST',
        url: `/oauth/authorize?app_id=${fixApp.appId}&redirect_uri=invalid`,
        credentials: new User(fixUser),
        payload: {
          step: 'permissions',
          scopes: fixApp.allowedScopes.join(','),
        },
      });

      // Then
      expect(response.statusCode).to.equal(400);
      expect(response.payload).to.contain('Invalid redirect URI.');
    });

    it('should return 403 if requesting non allowed scope', async function () {
      // When
      const response = await server.inject({
        method: 'POST',
        url: `/oauth/authorize?app_id=${fixApp.appId}&redirect_uri=${fixApp.redirectUris[0]}`,
        credentials: new User(fixUser),
        payload: {
          step: 'permissions',
          scopes: 'users:delete',
        },
      });

      // Then
      expect(response.statusCode).to.equal(400);
      expect(response.payload).to.contain('Invalid scopes: users:delete.');
    });
  });
});
