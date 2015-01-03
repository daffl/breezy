var assert = require('assert');
var vdom = require('../../lib/renderer/vdom');

global.document = {
  createDocumentFragment: function() {
    return {
      children: [],
      appendChild: function(child) {
        this.children.push(child);
      }
    };
  }
};
describe('virtual-dom renderer', function() {
  it('creates a simple virtual DOM', function () {
    var renderer = vdom('<div class="test-{{other}}" id="hi">Content {{me}}</div>');
    var fragment = renderer({
      me: 'here',
      other: 'meh'
    });

    assert.equal(fragment.children.length, 1);

    var div = fragment.children[0];
    assert.equal(div.tagName.toLowerCase(), 'div');
    assert.equal(div._attributes.class, 'test-meh');
    assert.equal(div.childNodes[0].data, 'Content here');
  });

  it('sets checked attribute');
});
