var _ = require('lodash');
var htmlparser = require('htmlparser2');
var tags = require('./tags');

var Parser = module.exports = function(options) {
  this.tags = {};
  this.attributes = {};
  this.document = new tags.Root();
  this.parser = new htmlparser.Parser(this, _.extend({
    xmlMode: true,
    lowerCaseTags: true
  }, options));
  this.stack = [ this.document ];
};

_.extend(Parser.prototype, {
  onopentag: function(name, attribs) {
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
    _.each(attribs, function(value, name) {
      if(attributes[name]) {
        attributes[name].call(this, value, tag);
      }
    });
  },

  ontext: function(text) {
    this.add(new tags.Text(text));
  },

  onclosetag: function(name) {
    if(this.stack.length > 1 && tags.selfClosing.indexOf(name) === -1) {
      this.stack.pop();
    }
  },

  oncomment: function(comment) {
    this.add(new tags.Comment(comment));
  },

  onprocessinginstruction: function(name, text) {
    this.add(new tags.ProcessingInstruction(name, text));
  },

  onerror: function(error) {
    console.error(error);
  },

  add: function(child) {
    return _.last(this.stack).children.push(child);
  },

  tag: function(name, handler) {
    if(!handler) {
      this.defaultTag = name;
    } else {
      this.tags[name] = handler;
    }
  },

  attribute: function(name, handler) {
    this.attributes[name] = handler;
  },

  write: function(data) {
    this.parser.write(data);
  },

  reset: function() {
    this.parser.reset();
    this.document = new tags.Root();
    this.stack = [ this.document ];
  },

  end: function() {
    this.parser.end();
  }
});
