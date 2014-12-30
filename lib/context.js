var evaluator = require('./expression/evaluator');

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
	if(!(path && path.length)) {
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

Context.prototype.evaluate = function(text) {
	// We can do this every time since evaluators will be cached
	var renderer = evaluator(text);

	return renderer(this);
};
