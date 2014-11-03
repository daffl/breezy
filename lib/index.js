var tags = exports.tags = require('./tags');
var Parser = exports.Parser = require('./parser');
var attributes = exports.attributes = require('./attributes');
var Context = exports.Context = require('./context');
var getParser = exports.getParser = function(options) {
  var parser = new Parser(options);
  parser.tag(tags.Tag);

  tags.selfClosing.forEach(function(name) {
    parser.tag(name, tags.SelfClosingTag);
  });

  Object.keys(attributes).forEach(function(name) {
    parser.attribute(name, attributes[name]);
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
