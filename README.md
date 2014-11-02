# HTMLBreeze

A fast HTML5 renderer that supports custom elements and attributes.

## Example

HTMLBreeze uses HTML5 elements and custom attributes to render HTML5 based templates. For example an HTML page like:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>{{site.title}}</title>
  </head>
  <body>
    <h1>My image gallery</h1>
    
    <ul>
      <li for-each="images">
        <img src="{{src}}" alt="{{description}}">
      </li>
    </ul>
  </body>
</html>
```

Can be transformed like this:

```js
var breeze = require('html-breeze');
var fs = require('fs');

fs.readFile('path/to/page.html', function(error, page) {
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
```

Will render:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My page</title>
  </head>
  <body>
    <h1>My image gallery</h1>

    <ul>
      <li for-each="images">
        <img src="image/first.png" alt="The first image">
      </li><li for-each="images">
        <img src="image/second.png" alt="The second image">
      </li>
    </ul>
  </body>
</html>
```

## Built in attributes

### for-each

### show-if/show-if-not

### with