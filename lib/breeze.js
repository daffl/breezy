var htmlparser = require('htmlparser');
var Renderer = require('./renderer/html');
var attributes = require('./attributes');
var _ = require('underscore');

function Image(src, description, sizes) {
  this.src = src;
  this.description = description;
  this.sizes = sizes;
}

Image.prototype.isLarge = function(size) {
  return this.sizes.indexOf(size) !== -1;
};

require('fs').readFile('examples/page.html', function(err, data) {
  var handler = new htmlparser.DefaultHandler();
  var parser = new htmlparser.Parser(handler);
  parser.parseComplete(data.toString());

  var r = new Renderer(handler.dom);
  _.each(attributes, function(handler, name) {
    r.addAttribute(name, handler);
  });
  var html = r.render({
    eq: function(value, other) {

    },
    site: {
      title: 'My page'
    },
    something: function() {
      return this.site.title + ' yeah!';
    },
    images: [
      new Image('image/first.png', 'The first image', ['S', 'M', 'L']),
      new Image('image/second.png', 'The second image', ['S', 'L', 'XL'])
    ]
  });
  console.log(html);
});
