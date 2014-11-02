var breeze = require('../lib');
var fs = require('fs');

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
    images: [{
      src: 'image/first.png',
      description: 'The first image'
    }, {
      src: 'image/second.png',
      description: 'The second image'
    }]
  });

  console.log(rendered);
});
