var regex = /\{{2}\s*((\w|\.|@)+)\s*\}{2}/g;
var defaultProcessor = function (match, group) {
  return this.getValue(group) || '';
};

var Context = module.exports = function (data, parent) {
  this.parent = parent;
  this.data = data;
	this._lookups = {};

//  Object.defineProperties(this.data, {
//    '@this': {
//      get: function() {
//        return data;
//      }
//    },
//    '@key': {
//      get: function() {
//        return path ? path[path.length - 1] : null;
//      }
//    },
//    '@path': {
//      get: function() {
//        return path.join('.');
//      }
//    }
//  });
};

Context.prototype.evaluate = function(text) {
	var args = text.split(' ');
	var property = args.unshift();
	var evaluator = function() {
		var fnArgs = [];
		for(var i = 0; i < args.length; i++) {
			fnArgs.push(this.get(args[i]).value());
		}
		// this.get(property)
	};
};

Context.prototype.get = function(key, context) {
	if(this._lookups[key]) {
		return this._lookups[key];
	}

	var keys = typeof key === 'string' ? key.split('.') : key;
	var current = keys[0];
	if(typeof this.data[current] !== 'undefined') {

	}
	
	//if(!child && typeof this.data[key] !== 'undefined') {
	//	var data = this.data[key];
	//	var newChild = typeof data !== 'undefined' ? this.parent.get(keys) : new Context(data, this);
	//	child = (this._children[key] = newChild);
	//}


};

Context.prototype.value = function (path) {
	if(path) {
		path = typeof path === 'string' ? path.split('.') : path;

		var current = this.value();

		while(path.length && current && (current = current[path.shift()]));

		return current;
	}

  return this.data;
};

Context.prototype.process = function (text, callback) {
  return text.replace(regex, (callback || defaultProcessor).bind(this));
};

Context.prototype.get = function (path) {
	if(path === '@this') {
		path = [];
	}

	if(typeof path === 'string') {
		path = path.split('.');
	}

  var fullPath = this.path.concat(path);
  return new Context(this.getValue(path), fullPath, this.root);
};
