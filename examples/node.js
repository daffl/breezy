var breezy = require('../lib/breezy');
var data = {
  isNode: true,
  user: {
    username: 'daffl',
    name: 'David'
  },
  isFirst: function (image) {
    return this.images.indexOf(image) === 0;
  },
  isLast: function (image) {
    return this.images.indexOf(image) === this.images.length - 1;
  },
  images: [{
    "title": "First light",
    "link": "http://www.flickr.com/photos/37374750@N03/16032244980/",
    "image": "http://farm8.staticflickr.com/7525/16032244980_4052521ab6_m.jpg"
  }, {
    "title": "Yellow Daisy",
    "link": "http://www.flickr.com/photos/110649234@N07/16218828372/",
    "image": "http://farm8.staticflickr.com/7471/16218828372_5bc20dda73_m.jpg"
  }, {
    "title": "Striped Leaves",
    "link": "http://www.flickr.com/photos/110649234@N07/16033840027/",
    "image": "http://farm8.staticflickr.com/7538/16033840027_cd93d683e3_m.jpg"
  }]
};
var html = breezy.renderFile(__dirname + '/public/browser.html', data);

console.log(html);
