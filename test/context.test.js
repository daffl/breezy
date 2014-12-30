var regex = /\{{2}\s*(.*)\s*\}{2}/g;
var getString = function(text) {
	var result = text.match(/^["|'](.*)["|']$/);
	return result ? result[1] : null;
};
var getArgFn = function(part) {
	var str = getString(part);
	return function() {
			return str || this.get(part).value();
		};
};
var evaluators = {};
var getEvaluator = function(expr) {
	if(!evaluators[expr]) {
		var part;
		var parts = expr.split(/\s/);
		var evaluator = {
			main: parts.shift(),
			args: [],
			truthy: function(value) {
				return value;
			},
			falsey: function() {
				return '';
			}
		};

		if(expr.indexOf(':') !== -1) {
			evaluator.falsey = getArgFn(parts.pop());
		}

		if(expr.indexOf('?') !== -1) {
			evaluator.truthy = getArgFn(parts.pop());
		}

		for(var i = 0; i < parts.length; i++) {
			part = parts[i];
			evaluator.args.push(getArgFn(part));
		}

		evaluators[expr] = evaluator;
	}

	return evaluators[expr];
};

var Context = function (data, parent) {
	this.parent = parent;
	this.data = data;
};

Context.prototype.value = function() {
	return this.data;
};

Context.prototype.get = function (keys) {
	if(!(keys && keys.length)) {
		return this;
	}

	var path = typeof keys === 'string' ? keys.split('.') : keys;
	var current = this.data;

	for(var i = 0; i < path.length; i++) {
		current = current[path[i]];

		if(typeof current === 'undefined') {
			if(this.parent) {
				return this.parent.get(path);
			}
			break;
		}
	}

	var first = path[0];
	return new Context(this.data[first], this).get(path.slice(1));
};

Context.prototype.evaluate = function(expr) {
	var self = this;
	var evaluator = getEvaluator(expr);
	var main = this.get(evaluator.main);
	var value = main.value();

	if(typeof value === 'function') {
		var args = evaluator.args.map(function(argFn) {
			return argFn.call(self);
		});
		value = value.apply(main.parent.value(), args);
	}

	value = value ? evaluator.truthy.call(self) : evaluator.falsey.call(self);

	return value;
};

Context.prototype.process = function (text, callback) {
	return text.replace(regex, (callback || function (match, group) {
		return this.evaluate(group);
	}).bind(this));
};

var ctx = new Context({
	helpers: {
		hasSize: function(size, image) {
			return image.sizes.indexOf(size) !== -1;
		},

		eq: function(first, second) {
			return first === second;
		}
	},
	pageTitle: 'Test',
	meta: {
		title: 'Home'
	},
	images: [{
		src: 'image1.png',
		description: 'first',
		sizes: ['s', 'l']
	}]
});

var inner = ctx.get('meta.title');

console.log(inner.process('Hi {{helpers.eq "Tests" pageTitle ? "Bla" : "blu"}}'));