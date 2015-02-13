var htmlparser = require('htmlparser');
var _ = require('./utils');
var es6to5 = require('6to5');

function parse(text) {
  var parsed = es6to5.transform("`" + text + "`", { ast: false, runtime: true });
  var code = parsed.code.replace(/\"use strict\"\;\n\n/, '');

  return new Function('context', 'with(context) { return ' + code + ' }');
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

var parsed = exports.parse('<div class="${name === \'David\' && \'active\' || \'\'} person">Hello ${name}</div>');

console.log(parsed[0].attribs.class({ name: 'Davids' }));
