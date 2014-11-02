var assert = require('assert');
var Context = require('../lib').Context;

describe('Context tests', function() {
  it('.get gets properties', function() {
    var ctx = new Context({
      main: 'test',
      a: {
        nested: {
          thing: 'Hooray!'
        }
      }
    });

    assert.equal(ctx.get('main'), 'test');
    assert.equal(ctx.get('a.nested.thing'), 'Hooray!');
    assert.ok(typeof ctx.get('a.undef.property') === 'undefined');
  });

  it('.process replaces placeholders', function() {
    var ctx = new Context({
      main: 'test',
      a: {
        first: 'first one',
        second: 'second one'
      }
    });
    var text = 'This is a {{main}}! With {{a.first}} and {{a.second}} and {{test.undefined}}';

    assert.equal(ctx.process(text), 'This is a test! With first one and second one and {{test.undefined}}');
  });
});
