const githubOrgUserLink = require('./github-org-user-link');
const trelloOrgUserLink = require('./trello-org-user-link');
const slackOrgUserCreate = require('./slack-org-user-create');

module.exports = [
  githubOrgUserLink,
  trelloOrgUserLink,
  slackOrgUserCreate,
];
