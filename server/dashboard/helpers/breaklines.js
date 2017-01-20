const Handlebars = require('handlebars')

module.exports = (value) => {
  var text = Handlebars.Utils.escapeExpression(value);
  text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
  return new Handlebars.SafeString(text);
};