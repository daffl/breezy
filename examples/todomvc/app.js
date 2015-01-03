$(function() {
  var viewModel = {
    todos: [{
      text: 'First Todo',
      complete: false
    }, {
      text: 'Second Todo',
      complete: true
    }],

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

    clearCompleted: function() {
      this.todos = this.filter(false);
    },

    toggleAll: function(complete) {
      this.todos.forEach(function(todo) {
        todo.complete = complete;
      });
    },

    allComplete: function() {
      return this.complete() === this.todos.length;
    },

    complete: function() {
      return this.filter(true).length;
    },

    remaining: function() {
      return this.todos.length - this.complete();
    },

    addTodo: function(text) {
      this.todos.push({
        text: text,
        complete: false
      });
    }
  };

  var observers = {};
  var isDirty = false;
  var flag = function() {
    if(!isDirty) {
      isDirty = true;

      if(window.requestAnimationFrame) {
        window.requestAnimationFrame(render);
      } else {
        setTimeout(render, 20);
      }
    }
  };
  var renderer = breezy.compile(document.getElementById('todoapp'), {
    read: function(path, context) {
      if(!observers[path]) {
        if(typeof context.data !== 'function') {
          var observer = observers[path] = new PathObserver(viewModel, path);
          observer.open(function(value) {
            if(typeof value === 'undefined') {
              observer.close();
              delete observers[path];
            }
            flag();
          });
        }
      }
    }
  });

  var render = function() {
    var start = new Date().getTime();
    renderer(viewModel);
    console.log('Rendering took', new Date().getTime() - start, 'ms');
    isDirty = false;
  };

  render();

  $('#todoapp').on('keypress', '#new-todo', function(ev) {
    if(ev.keyCode === 13) {
      viewModel.addTodo($(this).val());
      $(this).val('');
    }
  }).on('keypress', '.todo .edit', function(ev) {
    if(ev.keyCode === 13) {
      var index = $(this).parents('.todo').data('index');
      var todo = viewModel.todos[index];

      todo.text = $(this).val();
      todo.editing = false;
    }
  }).on('click', '#toggle-all', function() {
    viewModel.toggleAll($(this).prop('checked'));
  }).on('dblclick', '.todo label', function(ev) {
    var parent = $(this).parents('.todo');
    var index = parent.data('index');
    viewModel.todos[index].editing = true;
    parent.find('.edit').focus();
  }).on('blur', '.edit', function() {
    var index = $(this).parents('.todo').data('index');
    var todo = viewModel.todos[index];

    todo.text = $(this).val();
    todo.editing = false;
  }).on('click', '.destroy', function() {
    var index = $(this).parents('.todo').data('index');
    viewModel.todos.splice(index, 1);
  }).on('click', '#clear-completed', function() {
    viewModel.clearCompleted();
  }).on('click', '.todo .toggle', function() {
    var index = $(this).parents('.todo').data('index');
    var todo = viewModel.todos[index];
    todo.complete = $(this).prop('checked');
  });
});