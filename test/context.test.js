var assert = require('assert');
var Context = require('../lib/context');

describe('Context tests', function() {
	var data = {
		some: {
			thing: 'test'
		},
		other: {
			here: [ 'one', 'two' ]
		}
	};

	it('gets contexts', function() {
		var ctx = new Context(data);
		var got = ctx.get('other.here.0');

		assert.deepEqual(ctx.get().value(), data);
		assert.ok(got instanceof Context);
		assert.equal(got.value(), 'one');
		assert.deepEqual(got.parent.value(), ['one', 'two']);
		assert.equal(ctx.get('some').value('thing'), 'test');
	});

	it('runs hooks ($this, $path, $key)', function() {
		var ctx = new Context(data);
		var got = ctx.get('other.here.0');

		assert.equal(got.get('$this'), got);
		assert.equal(got.parent.value('$key'), 'here');
		assert.equal(got.value('$path'), 'other.here.0');
	});

	it('properties have precedence before hooks', function() {
		var ctx = new Context({
			prop: { '$key': 'value' }
		});

		assert.equal(ctx.get('prop').value('$key'), 'value');
	});

	it('lookups walk up to the parent', function() {
		var ctx = new Context(data);
		var got = ctx.get('other.here.0');

		assert.equal(got.value('some.thing'), 'test');
	});

	it('$this.property does not walk up to the parent', function() {
		var ctx = new Context({
			title: 'My thing',
			sub: {
				message: 'hello'
			}
		});

		var sub = ctx.get('sub');

		assert.equal(sub.value('title'), 'My thing');
		assert.equal(sub.value('$this.title'), undefined);
	});

	it('runs expression with a context', function() {
		var ctx = new Context({
			helpers: {
				getMessage: function(text) {
					return 'Hello ' + text;
				}
			},
			nullish: function() {
				return null;
			},
			my: {
				text: 'World?'
			}
		});

		var inner = ctx.get('my.text');

		assert.equal(inner.expression('helpers.getMessage my.text'), 'Hello World?');
		assert.equal(inner.expression('helpers.getMessage "Welt!"'), 'Hello Welt!');
		assert.equal(inner.expression('nullish'), null);
	});

	it('evaluates template with context', function() {
		var ctx = new Context({
			top: 'Hi',
			message: 'Hello',
			other: {
				message:'Hallo'
			}
		});

		assert.equal(ctx.evaluate('{{message}} World!'), 'Hello World!');
		assert.equal(ctx.evaluate('{{other.message}} World!'), 'Hallo World!');
	});

	it('evaluates text with truthy and falsy expressions', function () {
		var c = new Context({
			helpers: {
				eq: function(first, other) {
					return first === other;
				}
			},

			test: 'me'
		});

		assert.equal('Hello World!', c.evaluate('{{helpers.eq test "me" ? "Hello" : "Goodbye"}} World!'));
		assert.equal('Goodbye World!', c.evaluate('{{helpers.eq test "mes" ? "Hello" : "Goodbye"}} World!'));
	});
});
