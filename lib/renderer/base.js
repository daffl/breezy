var _ = require('../utils');

function Renderer(dom) {
  this.dom = dom;
  this.tags = {};
  this.attributes = {};
}

Renderer.prototype.tag = function (dom, context) {
  var self = this;
  var renderer = this.renderers.tag.bind(this);
  var tagHandler = this.tags[dom.name];

  if(tagHandler) {
    var old = renderer;
    renderer = function(dom, context) {
      return tagHandler.call(this, dom, context, old);
    };
  }

  _.each(dom.attribs, function(value, name) {
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

Renderer.prototype.render = function(context) {
  return this.list(this.dom, context);
};

['join', 'comment', 'directive', 'text', 'list', 'script'].forEach(function(name) {
  Renderer.prototype[name] = function () {
    return this.renderers[name].apply(this, arguments);
  };
});

module.exports = Renderer;
