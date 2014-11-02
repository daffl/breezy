var defaultRegex = /\{{2}\s*((\w|\.)+)\s*\}{2}/g;

var Context = module.exports = function(data, regex) {
  this.data = data;
  this.regex = regex || defaultRegex;
};

Context.prototype.process = function(text) {
  var self = this;

  return text.replace(this.regex, function(match, group) {
    return self.get(group) || match;
  });
};


Context.prototype.get = function(path) {
  var keys = path.split('.');
  var current = this.data;

  while(keys.length && (current = current[keys.shift()]));

  return current;
};
