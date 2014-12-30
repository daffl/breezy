var _ = require('underscore');
var Context = require('../context');

function Renderer(dom) {
  this.dom = dom;
  this.tags = {};
  this.attributes = {};
}

Renderer.extend = function(renderers) {
  var Result = function() {
    Renderer.apply(this, arguments);
  };

  Result.prototype = Object.create(Renderer.prototype);
  Result.prototype.renderers = renderers;

  return Result;
};

Renderer.prototype.tag = function (dom, context) {
  var self = this;
  var renderer = _.bind(this.renderers.tag, this);
  var tagHandler = self.tags[dom.name];

  if(tagHandler) {
    var old = renderer;
    renderer = function(dom, context) {
      return tagHandler.call(this, dom, context, old);
    };
  }

  _.each(dom.attribs || {}, function (value, name) {
    var attrHandler = self.attributes[name];
    var old = renderer;
    if(attrHandler) {
      renderer = function(dom, context) {
        return attrHandler.call(self, value, context, dom, old);
      };
    }
  });

  return this.join(renderer(dom, context));
};

Renderer.prototype.addAttribute = function(name, handler) {
  this.attributes[name] = handler;
};

Renderer.prototype.addTag = function(name, handler) {
  this.tags[name] = handler;
};

Renderer.prototype.render = function (data) {
  return this.list(this.dom, new Context(data));
};

_.each(['join', 'comment', 'directive', 'text', 'list'], function(name) {
  Renderer.prototype[name] = function () {
    return this.renderers[name].apply(this, arguments);
  };
});

module.exports = Renderer;
