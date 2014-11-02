var assert = require('assert');
var lib = require('../lib');
var Context = lib.Context;
var tags = lib.tags;
var attributes = lib.attributes;

describe('Attribute tests', function() {
  it('for-each', function() {
    var tag = new tags.Tag('div', {
      class: '{{some}}-thing'
    });
    var strong = new tags.Tag('strong');
    tag.children.push(strong);
    strong.children.push(new tags.Text('{{some}}'));

    attributes['for-each']('somes', tag);

    var html = tag.render(new Context({
      somes: [{
        some: 'first'
      }, {
        some: 'second'
      }]
    }));

    assert.equal(html, '<div class="first-thing"><strong>first</strong></div>' +
      '<div class="second-thing"><strong>second</strong></div>');
  });

  it('show-if', function() {
    var tag = new tags.Tag('div', {
      class: '{{some}}-thing'
    });
    tag.children.push(new tags.Text('{{some}}'));

    attributes['show-if']('test', tag);

    var html = tag.render(new Context({
      test: true,
      some: 'replace'
    }));

    assert.equal(html, '<div class="replace-thing">replace</div>');
    html = tag.render(new Context({
      some: 'replace'
    }));

    assert.equal(html, '');
  });

  it('with', function() {
    var tag = new tags.Tag('div', {});
    tag.children.push(new tags.Text('{{stuff}}'));

    attributes['with']('some', tag);

    var html = tag.render(new Context({
      some: {
        stuff: 'Got it'
      }
    }));

    assert.equal(html, '<div>Got it</div>');
  });
});
