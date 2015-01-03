var vdom = require('virtual-dom');

var _ = require('../utils');
var Renderer = require('./base');
var Context = require('../context');

var VDomRenderer = _.inherit(Renderer, {
  renderers: {
    comment: function () {
      return null;
    },

    directive: function () {
      return null;
    },

    text: function (dom, context) {
      return context.evaluate(dom.data);
    },

    script: function () {
      return this.tag.apply(this, arguments);
    },

    tag: function (dom, context) {
      var children = this.list(dom.children || [], context);
      var properties = {
        attributes: {}
      };
      var selector = dom.name;

      _.each(dom.attribs, function (value, name) {
        properties.attributes[name] = context.evaluate(value);
      });

      return vdom.h(selector, properties, children);
    },

    list: function (dom, context) {
      var self = this;
      return this.join(dom.map(function (current) {
        return self[current.type](current, context);
      }));
    },

    join: function (elements) {
      if (!Array.isArray(elements)) {
        return elements;
      }

      var result = [];
      elements.forEach(function (node) {
        // Context switches (e.g for-each) can produce an array of nodes
        if (Array.isArray(node)) {
          result.push.apply(result, node);
        } else {
          result.push(node);
        }
      });

      return result;
    }
  }
});

module.exports = function(content, options) {
  options = options || {};

  var html = content.outerHTML ? content.outerHTML : content;
  var renderer = new VDomRenderer(_.parseHtml(html, {
    ignoreWhitespace: true
  }));

  var fragment = document.createDocumentFragment();
  var updaters;

  var result = function(data) {
    var nodes = renderer.render(new Context(data, options.read));
    var makeUpdater = function(tree) {
      var currentTree = tree;
      var node = vdom.create(currentTree);

      fragment.appendChild(node);

      return function(newTree) {
        var patches = vdom.diff(currentTree, newTree);
        node = vdom.patch(node, patches);
        currentTree = newTree;

        return node;
      };
    };

    if(!updaters) {
      updaters = nodes.map(makeUpdater);
      if(content.parentNode && typeof content.parentNode.replaceChild === 'function') {
        content.parentNode.replaceChild(fragment, content);
      }

      return fragment;
    } else {
      updaters.forEach(function(update, index) {
        update(nodes[index]);
      });
    }
  };

  result.renderer = renderer;
  return result;
};

module.exports.Renderer = VDomRenderer;
