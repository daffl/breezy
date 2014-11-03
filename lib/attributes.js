var Context = require('./context');

exports['for-each'] = function(value, tag) {
  tag.addRenderer(function(context, next) {
    var list = context.get(value);
    return typeof list.map === 'function' ? list.map(function(data) {
      return next(new Context(data));
    }).join('') : '';
  });
};

exports['show-if'] = function(value, tag) {
  tag.addRenderer(function(context, next) {
    return !!context.get(value) ? next(context) : '';
  });
};

exports['show-if-not'] = function(value, tag) {
  tag.addRenderer(function(context, next) {
    return !context.get(value) ? next(context) : '';
  });
};

exports['with'] = function(value, tag) {
  tag.addRenderer(function(context, next) {
    return next(new Context(context.get(value)));
  });
};
