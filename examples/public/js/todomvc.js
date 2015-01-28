(function() {
  // Get todos from localStorage
  var todos = JSON.parse(localStorage.getItem('todos-breezy') || '[]');
  // Initialize the view model
  var viewModel = ViewModel.create(todos);

  // A simple CanJS-style controller
  var Controller = {
    '#new-todo keypress': function(context, ev) {
      if(ev.keyCode === 13) {
        viewModel.addTodo(ev.target.value);
        ev.target.value = '';
      }
    },

    '#toggle-all click': function(context, ev) {
      viewModel.toggleAll(ev.target.checked);
    },

    '#clear-completed click': function() {
      viewModel.clearCompleted();
    },

    '.todo .edit keypress': function(todo, ev) {
      if(ev.keyCode === 13) {
        todo.text = ev.target.value;
        todo.editing = false;
      }
    },

    '.todo label dblclick': function(todo) {
      todo.editing = true;
    },

    '.edit change': function(todo, ev) {
      todo.text = ev.target.value;
      todo.editing = false;
    },

    '.destroy click': function(todo) {
      viewModel.todos.splice(viewModel.todos.indexOf(todo), 1);
    },

    '.todo .toggle click': function(todo, ev) {
      todo.complete = ev.target.checked;
    }
  };

  window.addEventListener('load', function() {
    // Initialize all the even listeners from `Controller`
    Object.keys(Controller).forEach(function(event) {
      // Split into selector and event name
      var lastIndex = event.lastIndexOf(' ');
      var selector = event.substring(0, lastIndex);
      var eventName = event.substring(lastIndex + 1, event.length);

      // Add the event listener at the document level
      document.addEventListener(eventName, function(ev) {
        var el = ev.target;
        var matches = el.mozMatchesSelector || el.webkitMatchesSelector ||
          el.msMatchesSelector || el.oMatchesSelector || el.matches;

        // Only dispatch when the event is meant for us
        if(matches.call(el, selector)) {
          // Get the context used when rendering the target element
          var context = breezy.context(ev.target);
          // Call the Controller action
          Controller[event].call(Controller, context, ev, this);
        }
      });
    });

    breezy.render(document.getElementById('todoapp'), viewModel);
  });

  // Default window hash
  window.location.hash = 'all';
  // Listen to hash changes
  window.addEventListener('hashchange', function() {
    viewModel.setSelection(window.location.hash.substring(1));
  });
  // Store data back in localStorage
  window.addEventListener('unload', function() {
    localStorage.setItem('todos-breezy', JSON.stringify(todos));
  });
})();
