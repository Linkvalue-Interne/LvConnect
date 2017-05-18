# LvConnect

This project aims to unify login over all LinkValue apps with an authentication service based on OAuth2.

## Api reference

Below are listed all the endpoints available for now in the application.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/3e4e5a81552f2a8d6e7e#?env%5BProd%5D=W3siZW5hYmxlZCI6dHJ1ZSwia2V5IjoiaG9zdCIsInZhbHVlIjoiaHR0cHM6Ly9sdmNvbm5lY3QubGluay12YWx1ZS5mciIsInR5cGUiOiJ0ZXh0In0seyJlbmFibGVkIjp0cnVlLCJrZXkiOiJ1c2VyX2lkIiwidmFsdWUiOiI1OTAyMTU5Y2NkY2Y0NTBhZTE5ZDQxMzQiLCJ0eXBlIjoidGV4dCJ9LHsiZW5hYmxlZCI6dHJ1ZSwia2V5IjoiYWNjZXNzX3Rva2VuIiwidmFsdWUiOiI3OWM1YTJiYy0zOGZlLTQwNGUtODAzYi0yNjViZTliNzkzZDYiLCJ0eXBlIjoidGV4dCJ9XQ==)

#### Public endpoints
- [/oauth](docs/endpoint-oauth.md) (Authentication endpoint)

#### Protected endpoint

All the endpoints listed below are protected and require authentication with an access token.
This token must be issued from the oauth endpoint (see documentation above).
This token must be passed in the `Authorization` header as `Bearer`.

- [/users](docs/endpoint-users.md) (Users endpoint)

#### SDKs

- PHP: [MajoraLvConnectSdk](https://gitlab.com/LinkValue/Lab/MajoraLvConnectSdk)

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
node .
```

The server listens to `localhost:5000` in dev, `lvconnect.herokuapp.com` in staging and`lvconnect.link-value.fr` in production.

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
  mailjet: {
    apiKey: '',
    apiToken: '',
  },
};
```

This config file should be saved in `config` folder under the name `local.js` or `local.json`.

## Deployment

Deployment is made with GitLabCI using the `.gitlab-ci.yml` configuration file. It uses a Specific Docker Runner to run
the deployment jobs. This Runner is hosted on the production machine for the moment.

#### Staging

Deployment to staging environment (Heroku) is automatic. Each commit to `master` branch will trigger a deployment if tests are passing.

#### Production

To deploy LVConnect in production, you need to create a new version tag with the following command:

```shell
npm version [patch|minor|major]
```

This tag will trigger a deployment job in GitLabCI for production environment.
You'll have to manually start the job to prevent unwanted deployments.
To accept the job got to the [Job](https://gitlab.com/LinkValue/Lab/LvConnect/builds) interface of GitLab.

## CLI

LVConnect has a command line interface to help you do quick tasks. To run the cli, use the following command:

```shell
./bin/cli.js [command] [...options]
```

Here's the command help (you can also access it by using the `--help` option):

```
Usage: cli [options] [command]


  Commands:

    create-superuser           Creates admin user with admin@link-value.fr/admin
    send-welcome-mail [email]  Send welcome email to given email address

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```
