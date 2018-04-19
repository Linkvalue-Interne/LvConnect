<a name="1.7.2"></a>
## [1.7.2](https://github.com/LinkValue/LvConnect/compare/v1.7.1...v1.7.2) (2018-04-19)


### Bug Fixes

* **oauth:** Fix client credentials grant ([7e42071](https://github.com/LinkValue/LvConnect/commit/7e42071))


### Features

* **app:** Add basic login in frontend app ([0a18eb4](https://github.com/LinkValue/LvConnect/commit/0a18eb4))
* **app:** Add workspaces for frontend ([f3c805f](https://github.com/LinkValue/LvConnect/commit/f3c805f))
* **monitoring:** Add more metrics to monitoring ([ad0d35c](https://github.com/LinkValue/LvConnect/commit/ad0d35c))
* **oauth:** Better design of oauth authorization pipe ([12bf21c](https://github.com/LinkValue/LvConnect/commit/12bf21c))



<a name="1.7.1"></a>
## [1.7.1](https://github.com/LinkValue/LvConnect/compare/v1.7.0...v1.7.1) (2018-02-20)


### Bug Fixes

* **oauth:** fix lint error ([60bb840](https://github.com/LinkValue/LvConnect/commit/60bb840))
* **oauth:** fixed bad usage of Hapi reply interface ([ccb8a82](https://github.com/LinkValue/LvConnect/commit/ccb8a82))
* **oauth:** fixed oauth login error message and HTTP codes ([d8586e9](https://github.com/LinkValue/LvConnect/commit/d8586e9))



<a name="1.7.0"></a>
# [1.7.0](https://github.com/LinkValue/LvConnect/compare/v1.6.2...v1.7.0) (2018-02-02)


### Features

* **dashboard:** Add possibility to have multiple redirect uris for apps ([165f883](https://github.com/LinkValue/LvConnect/commit/165f883))
* **oauth:** Add forgot password link in oauth modal ([63289aa](https://github.com/LinkValue/LvConnect/commit/63289aa))
* **oauth:** Add response type token for authorization pipeline ([919db16](https://github.com/LinkValue/LvConnect/commit/919db16))



<a name="1.6.2"></a>
## [1.6.2](https://github.com/LinkValue/LvConnect/compare/v1.6.1...v1.6.2) (2017-11-27)


### Bug Fixes

* **oauth:** fixed issue with not found application by client_id ([b20cf47](https://github.com/LinkValue/LvConnect/commit/b20cf47))


### Features

* **dashboard:** Add possibility to edit the email address ([6dc9685](https://github.com/LinkValue/LvConnect/commit/6dc9685))



<a name="1.6.1"></a>
## [1.6.1](https://github.com/LinkValue/LvConnect/compare/v1.6.0...v1.6.1) (2017-11-27)



<a name="1.6.0"></a>
# [1.6.0](https://github.com/LinkValue/LvConnect/compare/v1.5.0...v1.6.0) (2017-11-27)


### Bug Fixes

* **oauth:** Add missing state when canceling authorization pipe ([190a630](https://github.com/LinkValue/LvConnect/commit/190a630))


### Features

* **oauth:** Add missing query params to authorization endpoint ([7438ad4](https://github.com/LinkValue/LvConnect/commit/7438ad4))
* **oauth:** Fix client_id query param on authorization endpoint ([00a8a97](https://github.com/LinkValue/LvConnect/commit/00a8a97))



<a name="1.5.0"></a>
# [1.5.0](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v1.4.2...v1.5.0) (2017-10-17)


### Bug Fixes

* **login:** Fix cookie SameSite property ([454ed1e](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/454ed1e))


### Features

* **config:** Extend refresh token TTL to 1 month ([32631d2](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/32631d2))
* **users:** Additional GET /users query params ([fd8ede1](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/fd8ede1))



<a name="1.4.2"></a>
## [1.4.2](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v1.4.1...v1.4.2) (2017-06-26)


### Bug Fixes

* **oauth:** Fix displaying permissions already accepted ([834518f](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/834518f))
* **oauth:** Fix multiple bugs with the SSO button ([5f4c920](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/5f4c920))



<a name="1.4.1"></a>
## [1.4.1](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v1.4.0...v1.4.1) (2017-06-26)


### Bug Fixes

* **oauth:** Fix invalid cookie in authorization popup ([9e6cb4a](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/9e6cb4a))



<a name="1.4.0"></a>
# [1.4.0](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v1.3.1...v1.4.0) (2017-06-23)


### Bug Fixes

* **login:** Fix reset password address ([697c9f5](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/697c9f5))
* **monitoring:** Fix monitoring event timing ([62102d7](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/62102d7))
* **monitoring:** Fix monitoring labels ([adc646c](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/adc646c))


### Features

* **login:** Add password reset ([882018b](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/882018b))
* **monitoring:** Add http basic auth for /metrics ([2af12d1](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/2af12d1))
* **monitoring:** Add metrics endpoint for Prometheus ([d00a744](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/d00a744))
* **oauth:** Add sso button route ([c0f1dd1](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/c0f1dd1))



<a name="1.3.1"></a>
## [1.3.1](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v1.3.0...v1.3.1) (2017-05-19)


### Bug Fixes

* **user:** Add email checking to prevent 500 errors ([e393f4a](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/e393f4a))



<a name="1.3.0"></a>
# [1.3.0](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v1.2.4...v1.3.0) (2017-05-18)


### Features

* **login:** Add Lax cookie policy ([1207f28](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/1207f28))



<a name="1.2.4"></a>
## [1.2.4](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v1.2.3...v1.2.4) (2017-05-18)


### Features

* **login:** fix secure cookie ([a51bf01](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/a51bf01))



<a name="1.2.3"></a>
## [1.2.3](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v1.2.2...v1.2.3) (2017-05-18)


### Features

* **login:** Secure cookie ([7edd0c7](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/7edd0c7))



<a name="1.2.2"></a>
## [1.2.2](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v1.2.1...v1.2.2) (2017-05-18)


### Bug Fixes

* **cli:** Fix cli mail send ([2993758](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/2993758))



<a name="1.2.1"></a>
## [1.2.1](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v1.2.0...v1.2.1) (2017-05-18)



<a name="1.2.0"></a>
# [1.2.0](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v1.1.0...v1.2.0) (2017-05-18)



<a name="1.1.0"></a>
# [1.1.0](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v1.0.0...v1.1.0) (2017-05-16)


### Bug Fixes

* **dashboard:** Fix fail edit user screen ([ab07b79](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/ab07b79))
* **dashboard:** Fix token invalidation ([ac2e6d1](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/ac2e6d1))


### Features

* **dashboard:** Add quick login for password change ([9f65562](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/9f65562))
* **dashboard:** Invalidate all sessions when changing password ([0657744](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/0657744))
* **mailjet:** Add mailjet API integration for account creation ([bcd9b86](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/bcd9b86))
* **oauth:** Cleanup tokens and authorizations on user delete ([991461c](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/991461c))
* **security:** Improved security ([bf71743](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/bf71743))



<a name="1.0.0"></a>
# [1.0.0](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v0.6.0...v1.0.0) (2017-05-12)


### Bug Fixes

* **apps:** Allow single value for allowed scopes ([c4c421f](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/c4c421f))
* **config:** Fixed configuration for Heroku ([0db2953](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/0db2953))
* **config:** Fixed scripts for Heroku ([7624823](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/7624823))
* **cors:** Add wildcard CORS ([b47e377](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/b47e377))
* **heroku:** Fix procfile ([b4150c3](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/b4150c3))
* **oauth:** Fix issue with auth code expireAt ([8702f4f](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/8702f4f))
* **scopes:** Use default application scopes if not specified ([16dff67](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/16dff67))
* **user:** add scope checking on GET /users/{id} ([461762b](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/461762b))


### Features

* **apps:** Add redirect URI and allowed scopes in app forms ([#72](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/72)) ([3985d95](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/3985d95))
* **config:** Configuration for Heroku ([806038b](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/806038b))
* **dashboard:** Force password change on user ([bd3554a](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/bd3554a))
* **deploy:** Add Heroku config ([#68](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/68)) ([a72674f](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/a72674f))
* **global:** Add / route redirecting to dashboard ([53cf5e5](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/53cf5e5))
* **heroku:** Add procfile for heroku ([951fa95](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/951fa95))
* **oauth:** Disable unit tests ([3b7e163](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/3b7e163))
* **oauth:** Force password change on user ([5135b06](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/5135b06))
* **user:** Add user city and removed user fallbackEmail ([64b4329](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/64b4329))
* **user:** Stabilize partner administration ([e0d6450](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/e0d6450))



<a name="0.6.0"></a>
# [0.6.0](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v0.5.1...v0.6.0) (2017-02-06)


### Features

* **login:** Redirect to dashboard if already logged in ([#65](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/65)) ([4802aed](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/4802aed))
* **oauth:** Add tests for authorize endpoint ([#66](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/66)) ([f68ec1f](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/f68ec1f))
* **oauth:** Added OAuth authorization process endpoint ([#60](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/60)) ([c323844](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/c323844))
* **security:** Add CSRF token protection on every form ([#64](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/64)) ([f31f3f8](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/f31f3f8)), closes [#62](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/62)
* **tasks:** Add workers for Slack, Trello and GitHub ([#67](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/67)) ([e5f29b7](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/e5f29b7))
* **templates:** Add page titles to every templates ([f2e6849](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/f2e6849))
* **users:** Add third party services calls ([cb76c8f](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/cb76c8f))
* **users:** Added user description and profilePictureUrl ([#63](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/63)) ([185fd53](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/185fd53)), closes [#59](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/59)



<a name="0.5.1"></a>
## [0.5.1](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v0.5.0...v0.5.1) (2017-01-20)



<a name="0.5.0"></a>
# [0.5.0](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v0.4.0...v0.5.0) (2017-01-20)



<a name="0.4.0"></a>
# [0.4.0](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v0.3.0...v0.4.0) (2016-12-16)


### Bug Fixes

* **doc:** Fixed some typos in the README ([#43](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/43)) ([97557c4](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/97557c4))


### Features

* **deps:** Updated dependencies ([#44](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/44)) ([680d451](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/680d451))
* **lint:** Bumped eslint config version ([#45](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/45)) ([384c7f1](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/384c7f1))
* **oauth:** Add handling of scopes ([#49](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/49)) ([3d120dd](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/3d120dd))
* **tests:** Add tests for /users endpoint ([#46](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/46)) ([05288de](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/05288de))
* **users:** Add query params handling to GET /users ([#48](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/48)) ([7c8a833](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/7c8a833))
* **users:** Add user roles handling ([#41](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/41)) ([c2b400f](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/c2b400f))



<a name="0.3.0"></a>
# [0.3.0](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v0.2.5...v0.3.0) (2016-12-09)


### Bug Fixes

* **oauth:** Fixed access token ttl and return it in /oauth/token ([#39](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/39)) ([7907e5a](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/7907e5a))


### Features

* **oauth:** Improved OAuth errors of token endpoint and docs ([#38](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/38)) ([25f7ff6](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/25f7ff6))
* **users:** Add GET /users/me route ([#40](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/40)) ([dfdda6b](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/dfdda6b))



<a name="0.2.5"></a>
## [0.2.5](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v0.2.4...v0.2.5) (2016-11-24)


### Bug Fixes

* **nvm:** Fix node version using nvm while running production script ([#31](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/issues/31)) ([af80139](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/af80139))



<a name="0.2.4"></a>
## [0.2.4](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v0.2.3...v0.2.4) (2016-10-21)



<a name="0.2.3"></a>
## [0.2.3](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v0.2.2...v0.2.3) (2016-10-21)


### Features

* **login:** Keep email when login fails ([49e5bdf](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/49e5bdf))



<a name="0.2.2"></a>
## [0.2.2](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v0.2.1...v0.2.2) (2016-10-21)



<a name="0.2.1"></a>
## [0.2.1](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v0.2.0...v0.2.1) (2016-10-21)



<a name="0.2.0"></a>
# [0.2.0](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v0.1.2...v0.2.0) (2016-10-21)


### Features

* **cli:** Added a CLI to build super user ([e4b78d3](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/e4b78d3))
* **login:** Update design with MDL ([558a4c1](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/558a4c1))
* **workers:** Added some logs for workers and status in user ([9f6114e](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/9f6114e))



<a name="0.1.2"></a>
## [0.1.2](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v0.1.1...v0.1.2) (2016-10-20)



<a name="0.1.1"></a>
## [0.1.1](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/v0.1.0...v0.1.1) (2016-10-20)



<a name="0.1.0"></a>
# [0.1.0](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/compare/75c1a2c...v0.1.0) (2016-10-20)


### Features

* **auth:** Add bearer token authentication ([4a860d4](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/4a860d4))
* **dashboard:** Add basic dashboard view ([ca81b0a](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/ca81b0a))
* **users:** Add user formatting (no _id, no __v, no password) ([75c1a2c](http://gitlab.com/LinkValue/Lab/LVConnect/LvConnect/commit/75c1a2c))



