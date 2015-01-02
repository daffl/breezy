// TODO allow for-each and with using expressions ?
exports['for-each'] = function (value, context, dom, next) {
  var list = context.get(value);
  return list.value().map(function(data, index) {
    return next(dom, list.get(index));
  });
};

exports['show-if'] = function (value, context, dom, next) {
  return !!context.expression(value) ? next(dom, context) : null;
};

exports['show-if-not'] = function (value, context, dom, next) {
  return !context.expression(value) ? next(dom, context) : null;
};

exports['with'] = function (value, context, dom, next) {
  return next(dom, context.get(value));
};
