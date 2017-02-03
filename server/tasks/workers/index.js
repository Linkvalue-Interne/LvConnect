const createOVHAccount = require('./create-ovh-account');
const githubOrgUserLink = require('./github-org-user-link');
const trelloOrgUserLink = require('./trello-org-user-link');
const slackOrgUserCreate = require('./slack-org-user-create');

module.exports = [
  createOVHAccount,
  githubOrgUserLink,
  trelloOrgUserLink,
  slackOrgUserCreate,
];
