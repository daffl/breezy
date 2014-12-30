var _ = require('underscore');
var Renderer = require('./base');

// A list of self closing HTML5 tags
var selfClosing = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img',
  'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

module.exports = Renderer.extend({
  comment: function (dom) {
    return '<!--' + dom.data + '-->';
  },

  directive: function (dom) {
    return '<' + dom.data + '>';
  },

  text: function (dom, context) {
    return context.process(dom.data);
  },

  tag: function (dom, context) {
    var tag = dom.name;
    var html = '<' + tag;

    _.each(dom.attribs, function(value, name) {
      html += ' ' + name + '="' + context.process(value) + '"';
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
    return this.join(_.map(dom, function(current) {
      return self[current.type](current, context);
    }));
  },

  join: function(elements) {
    return _.isArray(elements) ? elements.join('') : elements;
  }
});
