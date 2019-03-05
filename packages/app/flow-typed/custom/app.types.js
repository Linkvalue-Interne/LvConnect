// @flow

declare type App = {
  name: string,
  clientId?: string,
  clientSecret?: string,
  description: string,
  redirectUris: Array<string>,
  scopes: Array<string>,
}
