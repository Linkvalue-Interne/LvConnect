const qs = require('querystring');
const _ = require('lodash');

module.exports = function getFormUrl(req) {
  const queryParams = qs.stringify(_.omitBy({
    client_id: req.query.app_id || req.query.client_id,
    redirect_uri: req.query.redirect_uri,
    response_type: req.query.response_type,
    state: req.query.state,
    scope: req.query.scope,
  }, _.isEmpty));
  return `/oauth/authorize?${queryParams}`;
};
