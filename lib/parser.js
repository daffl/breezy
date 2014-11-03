var htmlparser = require('htmlparser2');
var tags = require('./tags');

var Parser = module.exports = function() {
  this.tags = {};
  this.attributes = {};
  this.document = new tags.Root();
  this.parser = new htmlparser.Parser(this, {
    xmlMode: true,
    lowerCaseTags: true
  });
  this.stack = [ this.document ];
};


Parser.prototype.onopentag = function(name, attribs) {
  var attributes = this.attributes;
  var tag = this.tags[name] ?
    new this.tags[name](name, attribs) :
    new this.defaultTag(name, attribs);

  tag.position = this.parser.startIndex;

  this.add(tag);

  if(tags.selfClosing.indexOf(name) === -1) {
    this.stack.push(tag);
  }

  // Add attribute processors
  Object.keys(attribs).forEach(function(name) {
    if(attributes[name]) {
      attributes[name].call(this, attribs[name], tag);
    }
  });
};

Parser.prototype.ontext = function(text) {
  this.add(new tags.Text(text));
};

Parser.prototype.onclosetag = function(name) {
  if(this.stack.length > 1 && tags.selfClosing.indexOf(name) === -1) {
    this.stack.pop();
  }
};

Parser.prototype.oncomment = function(comment) {
  this.add(new tags.Comment(comment));
};

Parser.prototype.onprocessinginstruction = function(name, text) {
  this.add(new tags.ProcessingInstruction(name, text));
};

Parser.prototype.onerror = function(error) {
  console.error(error);
};

Parser.prototype.add = function(child) {
  return this.stack[this.stack.length - 1].children.push(child);
};

Parser.prototype.tag = function(name, handler) {
  if(!handler) {
    this.defaultTag = name;
  } else {
    this.tags[name] = handler;
  }
};

Parser.prototype.attribute = function(name, handler) {
  this.attributes[name] = handler;
};

Parser.prototype.write = function(data) {
  this.parser.write(data);
};

Parser.prototype.reset = function() {
  this.parser.reset();
  this.document = new tags.Root();
  this.stack = [ this.document ];
};

Parser.prototype.end = function() {
  this.parser.end();
};
