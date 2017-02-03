# LvConnect

This project aims to unify login over all LinkValue apps with an authentication service based on OAuth2.

## Installation

You will need to have on your machine:
- [Redis](http://redis.io/) (>3.x)
- [MongoDB](https://www.mongodb.com/) (>3.x.x)

Then run in your cloned folder:
```shell
yarn
```

If you want to work on this project, run:
```shell
yarn dev
```

Or if you want the production mode:
```shell
yarn prod
```

The server listens to `localhost:5000` in dev and to `lvconnect.link-value.fr` for prod.

## Configuration

The project requires a local configuration file containing Slack, Trello and Github API tokens.
These config keys are not committed for security reasons, since they provide full access to target account.
The required keys are:

```js
module.exports = {
  trello: {
    apiKey: '',
    apiToken: '',
  },
  github: {
    apiToken: '',
  },
  slack: {
    apiToken: '',
  },
};
```

This config file should be saved in `config` folder under the name `local.js` or `local.json`.

## Api reference

Below are listed all the endpoints available for now in the application.

#### Public endpoints
- [/oauth](docs/endpoint-oauth.md) (Authentication endpoint)

#### Protected endpoint

All the endpoints listed below are protected and require authentication with an access token.
This token must be issued from the oauth endpoint (see documentation above).
This token must be passed in the `Authorization` header as `Bearer`.

- [/users](docs/endpoint-users.md) (Users endpoint)
