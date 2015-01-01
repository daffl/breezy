var htmlparser = require('htmlparser');
var attributes = require('./attributes');
var render = require('./renderer');

module.exports = function(content) {
  var handler = new htmlparser.DefaultHandler(function() {}, {
    ignoreWhitespace: true
  });
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

//exports.renderFile = function(path, options, fn){
//  // support callback API
//  if ('function' == typeof options) {
//    fn = options, options = undefined;
//  }
//  if (typeof fn === 'function') {
//    var res
//    try {
//      res = exports.renderFile(path, options);
//    } catch (ex) {
//      return fn(ex);
//    }
//    return fn(null, res);
//  }
//
//  options = options || {};
//
//  var key = path + ':string';
//
//  options.filename = path;
//  var str = options.cache
//      ? exports.cache[key] || (exports.cache[key] = fs.readFileSync(path, 'utf8'))
//      : fs.readFileSync(path, 'utf8');
//  return exports.render(str, options);
//};
//
//exports.__express = exports.renderFile;