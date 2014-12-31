var breezy = require('../lib/breezy');
var fs = require('fs');

function Image(src, description, sizes) {
  this.src = src;
  this.description = description;
  this.sizes = sizes;
}

Image.prototype.getDescription = function(text) {
  return text + ':' + this.description;
};

fs.readFile(__dirname + '/page.html', function(error, page) {
  if(error) {
    console.log(error);
    return;
  }

  var renderer = breezy(page);
  var rendered = renderer({
    site: {
      title: 'My site'
    },

    plural: function(number) {
      return number !== 2;
    },

    isLarge: function(image) {
      return image.sizes.indexOf('XL') !== -1;
    },

    images: [
      new Image('image/first.png', 'The first image', ['S', 'M', 'L']),
      new Image('image/second.png', 'The second image', ['S', 'L', 'XL'])
    ]
  });
  console.log(rendered);
});
