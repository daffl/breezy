# Breezy

A fast HTML5 view engine that renders using [virtual-dom](https://github.com/Matt-Esch/virtual-dom)
in the browser and strings in NodeJS.

[![Build Status](https://secure.travis-ci.org/daffl/breezy.png)](http://travis-ci.org/daffl/breezy)

## Example

Breezy uses custom HTML elements and attributes to render HTML5 based templates with [Expressions]() as placeholders.
For example, the following HTML template:

```html
<!DOCTYPE html>
<html>
<head>
    <title>{{site.title}}</title>
</head>
<body>
  <h1>{{name.toUpperCase}}'s image gallery</h1>

  <ul>
    <li for-each="images" class="{{isAt $this '1' ? 'first'}} {{isAt $this images.length ? 'last'}}">
        <img src="{{src}}" alt="{{description}}">
    </li>
  </ul>
</body>
</html>
```

Can be rendered with the following data:

```js
var data = {
  site: { title: 'My page' },
  name: 'david',
  isAt: function(image, index) {
    // Need to subtract 1 here so that we can compare `images.length`
    return this.images.indexOf(image) === parseInt(index, 10) - 1;
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
```

Which will result in:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My page</title>
</head>
<body>
<h1>DAVID's image gallery</h1>

<ul>
    <li for-each="images" class="first ">
        <img src="images/first.png" alt="The first image">
    </li><li for-each="images" class=" ">
        <img src="images/another.png" alt="Another image">
    </li><li for-each="images" class=" last">
        <img src="images/last.png" alt="The last image">
    </li>
</ul>
</body>
</html>
```

## Expressions

Breezy uses expressions as placeholders. A full expression looks like:

    path[.to.method] [arg... ] [? truthy] [: falsy]

`path` is either a direct or dot-separated nested property lookup. `args` can be any number of (whitespace separated)
parameters if the result of the path lookup is a function. Each parameter can either be another path
or a sinlge- or doublequoted string. The optional truthy and falsy block can be used to return another
value or string if the result is truthy or falsy.

Examples:

- Look up the `name` property: `name`
- Look up `site` and get the `title`: `site.title`
- Get `name` and call the `toUpperCase` string method: `name.toUpperCase`
- Call the `helpers.equal` method to check the name against a string: `helpers.equal name 'David'`
- Call `helpers.equal` method and return `Yes` if it matches: `helpers.equal name 'David' ? 'Yes'`
- Call `helpers.equal` method and return `No` if it does not match: `helpers.equal name 'David' : 'No'`
- Call `helpers.equal` method and return `Yes` if and `No` if it does not match: `helpers.equal name 'David' ? 'Yes' : 'No'`

`helpers.equal` can simply look like:

```js
function(first, second) {
    return first === second;
}
```

Expressions can be used in [Attributes]() or any other text when wrapped with double curly braces `{{}}`:

```html
<div show-if="helpers.equal name 'David'">Hi {{name.toUpperCase}} how are you?</div>
<img src="person.png" alt="This person is: {{helpers.equal name 'David' ? 'Dave' : 'I don\'t know'}}">
```

__Note:__ Dynamically adding attributes like <img {{helpers.equal name 'David' ? 'alt="This is David"'}}>
is currently not supported. This can almost always be done in a more HTML-friendly way, for example a [custom attribute]().

## Context

Normally properties are looked up as you would expect, for example

```html
<img src="{{images.1.src}}" alt="{{images.1.description}}">
```

Would get the attributes from the second image in the array. However, if the property is not found
in the current context, Breezy will try to look it up at the parent and so on until we are at the root
level (the data object you passed to the renderer). What this means is that for:

```html
<ul>
    <li for-each="images">{{site.title}}</li>
</ul>
```

The current context is the image we are currently iterating over (so properties like `src` and `description`
can be looked up directly) but, `site.title` is not a property of the current image. We will find it however
on level higher at the root element.

There are three *special properties* in any context:

- `$this` - Refers to the current context data (see the `{{isAt $this '1' ? 'first'}}` example)
- `$key` - Is the property name the current context came from (e.g. the index of the image in the array)
- `$path` - The full path of the context. For example `images.0`

## Attributes

Breezy implements a small number of custom HTML5 attributes that can be used to show/hide elements,
iterate over arrays or switch the context.

### for-each="property"

Iterates over a list and renders the tag for each element.

```html
<ul>
  <li for-each="images">
    <img src="{{src}}" alt="{{description}}">
  </li>
</ul>
```

__Important:__ *Currently `for-each` only supports property lookups so you can not use the result of an expression.*

### show-if="property"/show-if-not="property"

Show the tag if an expression is truthy or falsy.

```html
<div show-if-not="images.length">No images</div>
<div show-if="images.length">There are {{images.length}} images.</div>
```

If `show-if` or `show-if-not` does not currently apply to the element, it will be replaced with an
invisible element (`display: none;`) of the same type. This is necessary for the VirtualDOM to know
which element it is dealing with. With `images.length === 0` the example would render like this:

```html
<div show-if-not="images.length">No images</div>
<div style="display: none;"></div>
```

### with="property"

Switches the within this tag to the given property.

```html
<img with="images.1" src="{{src}}" alt="{{description}}">
```

__Important:__ *Currently `with` only supports property lookups so you can not use the result of an expression.*
