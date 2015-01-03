var _ = require('./utils');

// TODO allow for-each and with using expressions ?
exports['for-each'] = function (value, context, dom, next) {
  var list = context.get(value);
  return list.value().map(function(data, index) {
    return next(dom, list.get(index));
  });
};

exports.checked = function(value, context, dom, next) {
  var checked = !!context.expression(value);

  // We don't want to mess with our original DOM
  // shallow clone it and the attributes
  dom = _.clone(dom);
  dom.attribs = _.clone(dom.attribs);

  if(!checked) {
    delete dom.attribs.checked;
  } else {
    dom.attribs.checked = 'checked';
  }

  return next(dom, context);
};

exports['with'] = function (value, context, dom, next) {
  return next(dom, context.get(value));
};

// Creates an invisible placeholder DOM element of the same type if the flag is not true.
// We need this because all elements need to always be at the same position
var placeholder = function(flag, dom) {
  if(!flag) {
    return {
      name: dom.name,
      attribs: {
        class: '__placeholder__',
        style: 'display: none;'
      }
    };
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
