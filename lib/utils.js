var htmlparser = require('htmlparser');
var each = exports.each = function(obj, callback) {
  if(!obj || typeof obj !== 'object') {
    return;
  }

  if(Array.isArray(obj)) {
    return obj.forEach(callback);
  }

  return Object.keys(obj).forEach(function(key) {
    callback(obj[key], key);
  });
};

exports.inherit = function(Base, prototype) {
  var Result = function() {
    Base.apply(this, arguments);
  };

  Result.prototype = Object.create(Base.prototype);

  each(prototype, function(value, property) {
    Result.prototype[property] = value;
  });

  return Result;
};

exports.parseHtml = function(content, options) {
  var handler = new htmlparser.DefaultHandler(function() {}, options || {});
  var parser = new htmlparser.Parser(handler);

  parser.parseComplete(content.toString());

  return handler.dom;
};
