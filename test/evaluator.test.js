var assert = require('assert');
var evaluator = require('../lib/evaluator');

describe('Expression evaluator', function() {
  it('evaluates a simple expression', function() {
    var renderer = evaluator.text('{{hello.message}} world!');
    var context = {
      get: function(path) {
        assert.deepEqual(path, ['hello', 'message']);
        return {
          value: function() {
            return 'Hello';
          }
        };
      }
    };

    assert.equal(renderer(context), 'Hello world!');
  });

  it('calls a function with context arguments', function() {
    var renderer = evaluator.text('{{hello.message test "me"}} world!');
    var context = {
      value: function(path) {
        if(!path) {
          return this;
        }

        assert.deepEqual(path, ['test']);

        return 'ran test';
      },

      get: function(path) {
        assert.deepEqual(path, ['hello', 'message']);

        // Return a new dummy context with a function as the value
        return {
          parent: context,

          value: function() {
            return function(first, second) {
              assert.equal(this, context, 'Ran in the correct parent context');
              assert.equal(first, 'ran test', 'Got first evaluated argument');
              assert.equal(second, 'me', 'Got second string argument');

              return first + ' ' + second;
            };
          }
        };
      }
    };

    assert.equal(renderer(context), 'ran test me world!');
  });

  describe('truthy and falsy', function() {
    var value = true;
    var context = {
      get: function() {
        return {
          value: function() {
            return value;
          }
        };
      }
    };

    it('evaluates truthy returns undefined for falsy', function() {
      var renderer = evaluator.text('{{hello ? "Hello "}}world!');

      value = true;
      assert.equal(renderer(context), 'Hello world!');

      value = false;
      assert.equal(renderer(context), 'world!');
    });

    it('evaluates falsy returns undefined for truthy', function() {
      var renderer = evaluator.text('{{hello : "Hello "}}world!');

      value = true;
      assert.equal(renderer(context), 'world!');

      value = false;
      assert.equal(renderer(context), 'Hello world!');
    });

    it('evaluates truthy and falsy', function() {
      var renderer = evaluator.text('{{hello ? "Hello" : "Goodbye"}} world!');

      value = true;
      assert.equal(renderer(context), 'Hello world!');

      value = false;
      assert.equal(renderer(context), 'Goodbye world!');
    });
  });
});
