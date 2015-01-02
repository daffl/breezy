var fs = require('fs');
var _ = require('./utils');
var attributes = require('./attributes');
var renderer = require('./renderer');

exports.cache = {};

exports.compile = function(content, options) {
  options = options || {};

  var render = renderer.html;

  if(typeof options.render === 'string') {
    render = renderer[options.render];
  } else if(typeof window !== 'undefined' && window.document) {
    render = renderer.vdom;
  }

  var result = render(content);

  _.each(attributes, function(fn, name) {
    result.renderer.addAttribute(name, fn);
  });

  return result;
};

exports.renderFile = function(path, options, fn){
  // support callback API
  if ('function' == typeof options) {
    fn = options;
    options = undefined;
  }

  if (typeof fn === 'function') {
    var res;
    try {
      res = exports.renderFile(path, options);
    } catch (ex) {
      return fn(ex);
    }
    return fn(null, res);
  }

  options = options || {};

  var key = path + ':string';

  options.filename = path;

  var renderer = options.cache && options.cache[key];
  if(!renderer) {
    renderer = exports.compile(fs.readFileSync(path, 'utf8'), options);

    if(options.cache) {
      options.cache[key] = renderer;
    }
  }

  return renderer;
};

exports.__express = exports.renderFile;
