var evaluate = require('./evaluator');

var Context = module.exports = function (data, parent, key) {
	this.data = data;
	this.key = key;

	if(typeof parent === 'function') {
		this.read = parent;
	} else {
		this.parent = parent;
	}
};

Context.prototype.value = function(path) {
	if(path) {
		return this.get(path).value();
	}

  if(this.parent) {
    this.read();
  }

	return this.data;
};

Context.prototype.read = function(path, context) {
	if(this.parent && this.key) {
		path = path || [];
		path.unshift(this.key);
		this.parent.read(path, context || this);
	}
};

Context.prototype.call = function(identifier, context) {
	// e.g. 'displayTodos(selection)', context
	if(this.parent && this.key) {
		this.parent.call(this.key + '.' + identifier, context);
	}
};

Context.prototype.get = function (path, preventLookup) {
	if(typeof path === 'undefined' || path.length === 0) {
		return this;
	}

	path = Array.isArray(path) ? path : path.toString().split('.');

	// TODO maybe cache direct context lookups for better performance?
	var current = this.data;
	var key = path[0];

	if(this.hooks[key] && typeof this.data[key] === 'undefined') {
		return this.hooks[key].call(this, path);
	}

	for(var i = 0; i < path.length; i++) {
		current = current[path[i]];

		if(typeof current === 'undefined') {
			// Walk up to the parent
			if(this.parent && !preventLookup) {
				return this.parent.get(path);
			}

			// Trigger read for null values so that we can bind to them
			this.read(path, this);

			// Returns cached context for undefined
			return Context.Null;
		}
	}

	var result = this.data[key];
	var ctx = new Context(result, this, key);

	return path.length === 1 ? ctx : ctx.get(path.slice(1));
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

Context.prototype.hooks = {
	'$this': function(path) {
		if(path.length > 1) {
			return this.get(path.slice(1), true);
		}

		return this;
	},

	'$key': function() {
		return new Context(this.key);
	},

	'$path': function() {
		var current = this;
		var path = this.key;
		while(current.parent) {
			current = current.parent;
			if(current && current.key) {
				path = current.key + '.' + path;
			}
		}

		return new Context(path);
	}
};

Context.Null = new Context();
