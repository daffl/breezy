var _ = require('underscore');

exports['for-each'] = function (value, context, dom, next) {
  var list = context.get(value);

  return _.map(list.value(), function(data, index) {
    return next(dom, list.get(index));
  });
};

exports['show-if'] = function (value, context, dom, next) {
  return !!context.getValue(value) ? next(dom, context) : null;
};

exports['show-if-not'] = function (value, context, dom, next) {
  return !context.getValue(value) ? next(dom, context) : null;
};

exports['with'] = function (value, context, dom, next) {
  return next(dom, context.get(value));
};
