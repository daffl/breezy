# Breezy

A fast HTML5 renderer that supports custom elements and attributes.

[![Build Status](https://secure.travis-ci.org/daffl/breezy.png)](http://travis-ci.org/daffl/breezy)

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

Can be rendered with your data like this:

> npm install html-breeze

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

And will output:

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

### for-each="property"

Iterates over a list and renders the tag for each element.

```html
<ul>
  <li for-each="images">
    <img src="{{src}}" alt="{{description}}">
  </li>
</ul>
```


### show-if="property"/show-if-not="property"

Show the tag if a property is truthy or falsy.

```html
<div show-if-not="images.length">No images</div>
<div show-if="images.length">There are {{images.length}} images.</div>
```

### with="property"

Switches the within this tag to the given property.
