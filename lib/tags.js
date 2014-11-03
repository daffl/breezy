// A list of self closing HTML5 tags
exports.selfClosing = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img',
  'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

var Tag = exports.Tag = function(name, attributes) {
  this.children = [];
  this.name = name;
  this.attributes = attributes;
};

Tag.prototype.renderAttributes = function(context) {
  var attributes = this.attributes || {};

  return Object.keys(attributes).map(function(key) {
    var value = attributes[key];
    return key + '="' + context.process(value) + '"';
  });
};

Tag.prototype.render = function(context) {
  var children = this.children;
  var html = '<' + this.name;
  var attrs = this.renderAttributes(context);

  if(attrs.length) {
    html += ' ' + attrs.join(' ');
  }

  if(children.length === 0) {
    return html + ' />';
  }

  html += '>';
  children.forEach(function(child) {
    html += child.render(context);
  });

  return html + '</' + this.name + '>';
};

Tag.prototype.addRenderer = function(fn) {
  var old = this.render;
  this.render = function(context) {
    return fn.call(this, context, old.bind(this));
  };
};

var SelfClosingTag = exports.SelfClosingTag = function() {
  Tag.apply(this, arguments);
  delete this.children;
};

SelfClosingTag.prototype = Object.create(Tag.prototype);

SelfClosingTag.prototype.render = function(context) {
  var html = '<' + this.name;
  var attrs = this.renderAttributes(context);

  if(attrs.length) {
    html += ' ' + attrs.join(' ');
  }

  return html + '>';
};

var Text = exports.Text = function(text) {
  this.text = text;
};

Text.prototype.render = function(context) {
  return context.process(this.text);
};

var Comment = exports.Comment = function(comment) {
  this.comment = comment;
};

Comment.prototype.render = function() {
  return '<!--' + this.comment + '-->';
};

var Root = exports.Root = function() {
  this.children = [];
};

Root.prototype.render = function(context) {
  return this.children.map(function(child) {
    return child.render(context);
  }).join('');
};

var ProcessingInstruction = exports.ProcessingInstruction = function(name, text) {
  this.name = name;
  this.text = text;
};

ProcessingInstruction.prototype.render = function(context) {
  return '<' + context.process(this.text) + '>';
};
