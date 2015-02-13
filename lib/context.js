var _ = require('./utils');

function Context(data, parent, key, parentProperties) {
  if(typeof data !== 'object') {
    throw new Error('Context can only be initialized with objects');
  }

  parentProperties = parentProperties || [];

  var self = this;
  var myProps = Object.keys(data).filter(function(key) {
    return parentProperties.indexOf(key) === -1;
  }).concat(parentProperties);

  this.$this = data;
  this.$parent = parent;
  this.$key = key;

  parentProperties.forEach(function(prop) {
    this[prop] = parent[prop];
  });

  _.each(data, function (value, key) {
    var val = value;

    if(typeof value === 'object') {
      val = new Context(value, self, key, myProps);
    } else if(typeof value === 'function') {
      val = value.bind(data);
    }

    this[key] = val;
  });
}

var start = new Date().getTime();
var todos = [];
for(var i = 0; i < 1000; i++) {
  todos.push({
    text: 'Todo ' + i
  });
}
var ctx = new Context({
  name: 'David',
  hello: 'World',
  sayHi: function () {
    return this.name;
  },
  todos: todos,
  work: [{
    name: 'Bitovi',
    location: { city: 'Chicago' }
  }, {
    name: 'XInfo'
  }]
});

console.log(ctx)

console.log(new Date().getTime() - start);
//console.log(ctx.work[0].$parent.$this);
//console.log(ctx.work[1].name);
console.log(ctx.todos[100].sayHi());