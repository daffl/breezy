(function() {
  var ViewModel = {
    create:function(todos) {
      // Initializes a new ViewModel instance
      var vm = Object.create(ViewModel); // ES5 inheritance

      vm.todos = todos;
      vm.displayTodos = todos;
      vm.selection = 'all';

      return vm;
    },

    get allComplete() {
      return this.complete === this.todos.length;
    },

    get complete() {
      return this.filter(true).length;
    },

    get remaining() {
      return this.todos.length - this.complete;
    },

    equal: function(first, second) {
      return first === second;
    },

    filter: function(completed) {
      return this.todos.filter(function(todo) {
        return todo.complete === completed;
      });
    },

    plural: function(word, count) {
      if(count !== 1) {
        return word + 's';
      }

      return word;
    },

    setSelection: function(selection) {
      if(selection) {
        this.selection = selection;
      }

      this.displayTodos = this.todos;

      if(this.selection === 'active') {
        this.displayTodos = this.filter(false);
      }

      if(this.selection === 'completed') {
        this.displayTodos = this.filter(true);
      }
    },

    clearCompleted: function() {
      this.todos = this.filter(false);
      this.setSelection();
    },

    toggleAll: function(complete) {
      this.todos.forEach(function(todo) {
        todo.complete = complete;
      });
    },

    addTodo: function(text) {
      this.todos.push({
        text: text,
        complete: false
      });
    }
  };

  // Make it available as CommonJS or globally
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = ViewModel;
  } else {
    window.ViewModel = ViewModel;
  }
})();