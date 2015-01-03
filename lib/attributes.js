var _ = require('./utils');

// TODO allow for-each and with using expressions ?
exports['for-each'] = function (value, context, dom, next) {
  var list = context.get(value);

  return list.value().map(function(data, index) {
    return next(dom, list.get(index));
  });
};

exports.checked = function(value, context, dom, next) {
  // We don't want to mess with our original DOM
  // shallow clone it and the attributes (which we are modifying)
  dom = _.clone(dom);
  dom.attribs = _.clone(dom.attribs);
  dom.attribs.checked = !!context.expression(value);

  return next(dom, context);
};

exports['with'] = function (value, context, dom, next) {
  return next(dom, context.get(value));
};

// Creates an invisible placeholder DOM element of the same type if the flag is not true.
// We need this because all elements need to always be at the same position
var placeholder = function(flag, dom) {
  if(!flag) {
    var placeholder = {
      name: dom.name,
      attribs: {}
    };

    if(dom.name !== 'script') {
      placeholder.attribs.style = 'display: none;';
    }

    return placeholder;
  }

  return dom;
};

exports['show-if'] = function (value, context, dom, next) {
  dom = placeholder(!!context.expression(value), dom);
  return next(dom, context);
};

exports['show-if-not'] = function (value, context, dom, next) {
  dom = placeholder(!context.expression(value), dom);
  return next(dom, context);
};
