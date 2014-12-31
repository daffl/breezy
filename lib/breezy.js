var htmlparser = require('htmlparser');
var attributes = require('./attributes');
var render = require('./renderer');

module.exports = function(content) {
  var handler = new htmlparser.DefaultHandler();
  var parser = new htmlparser.Parser(handler);
  var result;

  parser.parseComplete(content.toString());

  if(typeof window !== 'undefined' && window.document) {
    result = render.vdom(handler.dom);
  } else {
    result = render.html(handler.dom);
  }

  Object.keys(attributes).forEach(function(name) {
    result.renderer.addAttribute(name, attributes[name]);
  });

  return result;
};
