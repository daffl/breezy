var breezy = require('../lib/breezy');
var data = {
  site: { title: 'My page' },
  name: 'david',
  first: function(image) {
    return this.images.indexOf(image) === 0;
  },
  last: function(image) {
    return this.images.indexOf(image) === this.images.length - 1;
  },
  images: [{
    src: 'images/first.png',
    description: 'The first image'
  }, {
    src: 'images/another.png',
    description: 'Another image'
  }, {
    src: 'images/last.png',
    description: 'The last image'
  }]
};
var html = breezy.renderFile(__dirname + '/public/page.html', data);

console.log(html);
