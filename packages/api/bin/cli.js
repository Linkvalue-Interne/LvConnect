#!/usr/bin/env node

const program = require('commander');

const createSuperUser = require('./cli-create-superuser');
const sendWelcomeEmail = require('./cli-send-welcome-mail');
const packageJSON = require('../package.json');

program
  .version(packageJSON.version);

program
  .command('create-superuser')
  .description('Creates admin user with admin@link-value.fr/admin')
  .action(createSuperUser);

program
  .command('send-welcome-mail [email]')
  .description('Send welcome email to given email address')
  .action(sendWelcomeEmail);

program
  .parse(process.argv);

if (process.argv.length < 3) {
  program.outputHelp();
}
