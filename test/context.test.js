var assert = require('assert');
var Context = require('../lib/context');

describe('Context tests', function() {
	it('initializes and evaluates', function () {
		var c = new Context({
			helpers: {
				eq: function(first, other) {
					return first === other;
				}
			},

			test: 'me'
		});

		assert.equal('Goodbye World!', c.evaluate('{{helpers.eq test "mes" ? "Hello" : "Goodbye"}} World!'));
	});
});
