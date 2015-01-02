var assert = require('assert');
var vdom = require('../../lib/renderer/vdom');

describe('virtual-dom renderer', function() {
  it('initializes', function () {
    var renderer = vdom('<div class="test" id="hi">Content {{me}}</div>');
    var fragment = renderer({
      me: 'here'
    });

    assert.ok(fragment);
  });
});
