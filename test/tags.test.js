var assert = require('assert');
var lib = require('../lib');
var tags = lib.tags;
var Context = lib.Context;

describe('html-breeze tag tests', function() {
  it('simple empty tag renders', function() {
    var tag = new tags.Tag('div', {
      class: 'dummy',
      style: 'display: none;'
    });

    assert.equal('<div class="dummy" style="display: none;" />', tag.render(new Context()),
      'Empty tag rendered as expected');
  });

  it('simple empty tag attributes get processed', function() {
    var tag = new tags.Tag('div', {
      class: '{{some}}-thing',
      style: 'display: none;'
    });

    assert.equal('<div class="replaced-thing" style="display: none;" />', tag.render(new Context({
      some: 'replaced'
    })), 'Empty tag rendered and attributes processed');
  });

  it('tag with children renders', function() {
    var tag = new tags.Tag('div', {
      class: '{{some}}-thing',
      style: 'display: none;'
    });
    var strong = new tags.Tag('strong');
    tag.children.push(new tags.Text('Some '));
    tag.children.push(strong);
    strong.children.push(new tags.Text('{{some}}'));

    assert.equal('<div class="replaced-thing" style="display: none;">Some <strong>replaced</strong></div>',
      tag.render(new Context({
        some: 'replaced'
      })));
  });

  it('SelfClosingTag', function() {
    var tag = new tags.SelfClosingTag('img', {
      src: 'image.png'
    });

    assert.ok(typeof tag.children === 'undefined', 'Tag has no children');
    assert.equal(tag.render(new Context()), '<img src="image.png">', 'Self closing tag rendered');
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
