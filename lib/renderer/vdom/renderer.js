var vdom = require('virtual-dom');
var _ = require('../../utils');
var Renderer = require('./../base');
var DataSet = require('./data-set');

module.exports = _.inherit(Renderer, {
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
        attributes: {},
        context: DataSet(context.data)
      };
      var selector = dom.name;

      _.each(dom.attribs, function (value, name) {
        if(name === 'checked') {
          properties.checked = value;
        } else {
          properties.attributes[name] = context.evaluate(value);
        }
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
