var breeze = require('../lib');
var fs = require('fs');

function Image(src, description, sizes) {
  this.src = src;
  this.description = description;
  this.sizes = sizes;
}

Image.prototype.isLarge = function(size) {
  return this.sizes.indexOf(size) !== -1;
};

fs.readFile(__dirname + '/page.html', function(error, page) {
  if(error) {
    console.log(error);
    return;
  }

  var renderer = breeze.compile(page);
  var rendered = renderer({
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
  console.log(rendered);
});
