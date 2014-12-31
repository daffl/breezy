var evaluate = require('./expression/evaluator');

var Context = module.exports = function (data, parent) {
	this.parent = parent;
	this.data = data;
};

Context.prototype.value = function(path) {
	if(path) {
		return this.get(path).value();
	}

	return this.data;
};

Context.prototype.get = function (path) {
	if(!Array.isArray(path)) {
		path = path + '';
	}

	if(typeof path === 'undefined' || path.length === 0 || (path.length === 1 && path[0] === 'this')) {
		return this;
	}

	path = typeof path === 'string' ? path.split('.') : path;

	// TODO maybe cache direct context lookups for better performance?
	var current = this.data;

	for(var i = 0; i < path.length; i++) {
		current = current[path[i]];

		if(typeof current === 'undefined') {
			// Walk up to the parent
			if(this.parent) {
				return this.parent.get(path);
			}
			break;
		}
	}

	var first = path[0];
	return new Context(this.data[first], this).get(path.slice(1));
};

Context.prototype.expression = function(expression) {
	var evaluator = evaluate.expression(expression);
	return evaluator(this);
};

Context.prototype.evaluate = function(text) {
	// We can do this every time since evaluators will be cached
	var renderer = evaluate.text(text);
	return renderer(this);
};
