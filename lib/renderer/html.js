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
    return context.evaluate(dom.data);
  },

  script: function() {
    return this.tag.apply(this, arguments);
  },

  tag: function (dom, context) {
    var tag = dom.name;
    var html = '<' + tag;

    Object.keys(dom.attribs || {}).forEach(function(name) {
      var value = dom.attribs[name];
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
});
