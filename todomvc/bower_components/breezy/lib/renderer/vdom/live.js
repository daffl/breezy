// Extends the vdom renderer options to automatically re-render
// on object changes using [Polymer's ObserveJS](https://github.com/polymer/observe-js)
module.exports = function(options) {
  var render, data; // Will be set in `initializing`
  var observers = {};
  var isDirty = false;

  // Marks the renderer state as dirty and requests a re-render
  // if not already taking place
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

  options.read = function(path, context) {
    var key = path.toString();
    if(!observers[key] && typeof context.data !== 'function') {
      // Open a new observer for the given path
      var observer = observers[key] = new options.PathObserver(data, path);
      observer.open(function(value) {
        // If the value is undefined, remove the listener
        if(typeof value === 'undefined') {
          observer.close();
          delete observers[key];
        }
        // Mark as dirty and request re-render
        flag();
      });
    }
  };

  options.initializing = function(renderer, liveData) {
    // Bring into the closure
    render = function() {
      renderer();
      isDirty = false;
    };
    data = liveData;
  };

  // Perform dirty-checking for Browsers that don't have Object.observe
  setInterval(function() {
    if(!isDirty) {
      Platform.performMicrotaskCheckpoint();
    }
  }, 50);

  return options;
};
