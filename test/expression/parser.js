var assert = require('assert');
var Parser = require('../../lib/expression/parser');

describe('Parser tests', function() {
  it('parses simple text expressions', function() {
    var parsed = Parser.parse('some expression');

    assert.equal(parsed.length, 1);
    assert.equal(parsed[0].type, 'text');
    assert.equal(parsed[0].value, 'some expression');
  });

  it('parses as expression in {{brackets}} and escapes strings', function() {
    var parsed = Parser.parse('{{some.thing text "a \\" string"}}');
    var expression = parsed[0];
    var args = expression.args;

    assert.equal(parsed.length, 1);

    assert.equal(expression.type, 'expression');
    assert.deepEqual(expression.path, ['some', 'thing']);
    assert.equal(expression.args.length, 2);
    assert.ok(!expression.truthy);
    assert.ok(!expression.falsy);

    assert.equal(args[0].type, 'path');
    assert.equal(args[1].type, 'string');
    assert.equal(args[1].value, 'a " string');
  });

  it('parses expression and text', function() {
    var parsed = Parser.parse('some expression {{some.thing text "a \\" string"}} test');
    var expression = parsed[1];
    var args = expression.args;

    assert.equal(parsed.length, 3);
    assert.equal(parsed[0].type, 'text');
    assert.equal(parsed[0].value, 'some expression ');

    assert.equal(expression.type, 'expression');
    assert.deepEqual(expression.path, ['some', 'thing']);
    assert.equal(expression.args.length, 2);

    assert.equal(args[0].type, 'path');
    assert.equal(args[1].type, 'string');
    assert.equal(args[1].value, 'a " string');

    assert.equal(parsed[2].value, ' test');
  });
});
