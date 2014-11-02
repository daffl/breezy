var _ = require('lodash');
var tags = exports.tags = require('./tags');
var Parser = exports.Parser = require('./parser');
var attributes = exports.attributes = require('./attributes');
var Context = exports.Context = require('./context');
var getParser = exports.getParser = function(options) {
  var parser = new Parser(options);
  parser.tag(tags.Tag);

  _.each(tags.selfClosing, function(name) {
    parser.tag(name, tags.SelfClosingTag);
  });

  _.each(attributes, function(handler, name) {
    parser.attribute(name, handler);
  });

  return parser;
};
var internal = getParser();

exports.compile = function(html) {
  internal.reset();
  internal.write(html);
  var doc = internal.document;
  internal.end();

  return function(data) {
    if(!(data instanceof Context)) {
      data = new Context(data);
    }

    return doc.render(data);
  };
};

//exports.registerInclude = function(name, html) {
//
//};
