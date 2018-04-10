const Handlebars = require('handlebars');
const _ = require('lodash');

const statusIcons = {
  stopped: 'stop',
  error: 'clear',
  pending: 'play_arrow',
  success: 'done',
};

const services = ['github', 'trello', 'slack'];

module.exports = (user) => {
  const statuses = _.map(_.pick(user.thirdParty, services), (status, service) =>
    `<span class="mdl-chip mdl-chip--deletable">
      <span class="mdl-chip__text">${service}</span>
      <button type="button" class="mdl-chip__action"><i class="material-icons">${statusIcons[status]}</i></button>
    </span>`).join('');
  return new Handlebars.SafeString(statuses);
};
