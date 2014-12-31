var Renderer = require('./base');
var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');

module.exports = Renderer.extend({
  comment: function () {
    return null;
  },

  directive: function () {
    return null;
  },

  text: function (dom, context) {
    return new VText(String(context.evaluate(dom.data)));
  },

  script: function() {
    return this.tag.apply(this, arguments);
  },

  tag: function (dom, context) {
    var children = this.list(dom.children || [], context);
    var attributes = {};

    Object.keys(dom.attribs || {}).forEach(function(name) {
      var value = dom.attribs[name];
      attributes[name] = context.evaluate(value);
    });

    return new VNode(dom.name, attributes, children);
  },

  list: function (dom, context) {
    var self = this;
    return this.join(dom.map(function(current) {
      return self[current.type](current, context);
    }));
  },

  join: function(elements) {
    if(!Array.isArray(elements)) {
      return elements;
    }

    var result = [];
    elements.forEach(function(node) {
      if(Array.isArray(node)) {
        result.push.apply(result, node);
      } else if(node) {
        result.push(node);
      }
    });

    return result;
  }
});
