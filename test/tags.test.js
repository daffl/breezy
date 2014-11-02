var assert = require('assert');
var lib = require('../lib');
var tags = lib.tags;
var Context = lib.Context;

describe('html-breeze tag tests', function() {
  it.skip('Tag', function() {

  });

  it.skip('SelfClosingTag', function() {

  });

  it('Text', function() {
    var txt = new tags.Text('{{some}} \n text');
    var rendered = txt.render(new Context({ some: 'hi!' }));

    assert.equal(rendered, 'hi! \n text', 'Text processed');
  });

  it('Comment', function() {
    var comment = new tags.Comment(' {{some}} comment ');
    var rendered = comment.render(new Context({ some: 'hi!' }));

    assert.equal(rendered, '<!-- {{some}} comment -->', 'Comment rendered and not processed');
  });

  it('ProcessingInstruction', function() {
    var inst = new tags.ProcessingInstruction('DOCTYPE', '!DOCTYPE {{type}}');
    var rendered = inst.render(new Context({ type: 'html' }));

    assert.equal(rendered, '<!DOCTYPE html>', 'Doctype parsed and processed');
  });

  it('Root', function() {
    var root = new tags.Root();
    root.children.push(new tags.Text('Hi {{you}}\n'));
    root.children.push(new tags.Text('Hi {{there}}'));

    var rendered = root.render(new Context({
      you: 'David',
      there: 'You'
    }));

    assert.equal(rendered, 'Hi David\nHi You', 'Root children rendered');
  });
});
