var htmlparser = require('htmlparser');
var _ = require('./utils');
var Brexpression = require('brexpressions');

function parse(text) {
  var parsed = Brexpression.parse(text);

  if(parsed.length === 1 && parsed[0].type === 'text') {
    return parsed[0].value;
  } else if(parsed.length === 0) {
    return null;
  }

  return parsed;
}

function convert(dom) {
  delete dom.raw;

  if(dom.type !== 'tag' && dom.type !== 'script') {
    dom.data = parse(dom.data);
  } else {
    delete dom.data;
  }

  _.each(dom.attribs, function(value, name) {
    dom.attribs[name] = parse(value);
  });

  _.each(dom.children, convert);

  return dom;
}

exports.parse = function(html, options) {
  var handler = new htmlparser.DefaultHandler(function() {}, options);
  var parser = new htmlparser.Parser(handler);

  parser.parseComplete(html.toString());

  var dom = handler.dom;

  _.each(dom, convert);

  return dom;
};
