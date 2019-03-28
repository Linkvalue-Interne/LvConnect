/* eslint-disable import/no-extraneous-dependencies */

const mongoose = require('mongoose');
const cucumber = require('cypress-cucumber-preprocessor').default;
const moment = require('moment');
const config = require('@lvconnect/config/server');
const { Client, Policy } = require('catbox');
const redis = require('catbox-redis');

require('@lvconnect/api/src/users/models/user.model');
require('@lvconnect/api/src/oauth/models/access-token.model');
require('@lvconnect/api/src/oauth/models/authorization.model');
require('@lvconnect/api/src/apps/models/application.model');
require('@lvconnect/api/src/hooks/models/hook.model');

const {
  mongodb: { url: mongodbUrl },
  mailjet: { emailStore },
  oauth: { scopes, privateScopes },
} = config;

const recursiveReplace = (value) => {
  if (Array.isArray(value)) {
    return value.map(recursiveReplace);
  }
  if (typeof value === 'object') {
    return Object.entries(value).reduce(
      (acc, [key, objectValue]) => Object.assign(acc, {
        [key]: recursiveReplace(objectValue),
      }),
      {},
    );
  }
  if (typeof value === 'string') {
    if (value.indexOf('ObjectId(') === 0) {
      return new mongoose.Types.ObjectId(value.match(/^ObjectId\((.*)\)$/)[1]);
    }
    if (value.indexOf('Date(') === 0) {
      const dateString = value.match(/^Date\((.*)\)$/)[1];
      const [match, symbol, amount, unit] = dateString.match(/^(\+|-)(\d+)(.*)$/) || [];
      return match
        ? moment()[symbol === '+' ? 'add' : 'subtract'](amount, unit).toDate()
        : moment(dateString).toDate();
    }
  }
  return value;
};

const emailCache = new Client(redis, emailStore);

module.exports = async (on) => {
  await emailCache.start();
  const emailCachePolicy = new Policy({ expiresIn: 1000 * 60 * 60 }, emailCache, emailStore.segment);

  on('file:preprocessor', cucumber());
  on('task', {
    'emails:get': async emailId => emailCachePolicy.get(emailId),
    'emails:count': async () => emailCache.connection.client.dbsize(),
    'database:clean': async (fixtures) => {
      await mongoose.connect(mongodbUrl, { useNewUrlParser: true, useCreateIndex: true });

      await mongoose.connection.dropDatabase();
      await emailCache.connection.client.flushdb();

      const promises = Object.entries(fixtures)
        .map(async ([collectionName, collectionFixtures]) => (mongoose.model(collectionName)
          .insertMany(collectionFixtures.map(fixture => recursiveReplace(fixture)))));

      return Promise.all(promises)
        .then(() => mongoose.connection.close())
        .then(() => true);
    },
    login: async (email) => {
      await mongoose.connect(config.mongodb.url, { useNewUrlParser: true, useCreateIndex: true });
      const user = await mongoose.model('User').findOne({ email });
      const { token } = await mongoose.model('AccessToken').create({ user, scopes: scopes.concat(privateScopes) });
      await mongoose.connection.close();
      return token;
    },
  });
};
