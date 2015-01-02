var _ = require('../utils');
var Context = require('../context');
var Renderer = require('./base');

// A list of self closing HTML5 tags
var selfClosing = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img',
  'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

var HTMLRenderer = _.inherit(Renderer, {
  renderers: {
    comment: function (dom) {
      return '<!--' + dom.data + '-->';
    },

    directive: function (dom) {
      return '<' + dom.data + '>';
    },

    text: function (dom, context) {
      return context.evaluate(dom.data);
    },

    script: function() {
      return this.tag.apply(this, arguments);
    },

    tag: function (dom, context) {
      var tag = dom.name;
      var html = '<' + tag;

      _.each(dom.attribs, function(value, name) {
        html += ' ' + name + '="' + context.evaluate(value) + '"';
      });

      if(dom.children && dom.children.length) {
        html += '>' + this.list(dom.children, context) + '</' + tag + '>';
      } else {
        html += !!~selfClosing.indexOf(tag) ? '>' : '/>';
      }

      return html;
    },

    list: function (dom, context) {
      var self = this;
      return this.join(dom.map(function(current) {
        return self[current.type](current, context);
      }));
    },

    join: function(elements) {
      return Array.isArray(elements) ? elements.join('') : elements;
    }
  }
});

module.exports = function(content) {
  var renderer = new HTMLRenderer(_.parseHtml(content));
  var result = function(data) {
    return renderer.render(new Context(data));
  };

  result.renderer = renderer;
  return result;
};

module.exports.Renderer = HTMLRenderer;
