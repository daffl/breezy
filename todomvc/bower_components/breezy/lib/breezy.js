var fs = require('fs');
var DataSet = require('data-set');
var _ = require('./utils');
var attributes = require('./attributes');
var renderer = require('./renderer');
var cachedFiles = exports.cachedFiles = {};

exports.attributes = attributes;
exports.renderers = renderer;

exports.context = function(node) {
  var hash = DataSet(node);
  return hash.context;
};

exports.compile = function(content, options) {
  options = options || {};

  var render = renderer.html;

  if(typeof options.render === 'string') {
    render = renderer[options.render];
  } else if(typeof window !== 'undefined' && window.document) {
    render = renderer.vdom;
  }

  var result = render(content, options);

  _.each(attributes, function(fn, name) {
    result.renderer.addAttribute(name, fn);
  });

  return result;
};

exports.render = function(content, data, options) {
  var renderer = exports.compile(content, options);

  if(_.isDomNode(content)) {
    renderer(data);
    return renderer;
  }

  return renderer(data);
};

exports.renderFile = function(path, options, fn){
  // support callback API
  if (typeof options === 'function') {
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

  var renderer = options.cache && cachedFiles[key];

  if(!renderer) {
    renderer = exports.compile(fs.readFileSync(path, 'utf8'));
    if(options.cache) {
      cachedFiles[key] = renderer;
    }
  }

  return renderer(options);
};

exports.__express = exports.renderFile;
