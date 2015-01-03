// Extends the vdom renderer options to automatically re-render
// on object changes using [Polymer's ObserveJS](https://github.com/polymer/observe-js)
module.exports = function(options) {
  var oldRead = options.read;
  var oldInitializing = options.initializing;

  var render = function() {};
  var data = {};
  var observers = {};
  var isDirty = false;

  // Marks the renderer state as dirty and requests a re-render
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

    if(typeof oldRead === 'function') {
      return oldRead.apply(this, arguments);
    }
  };

  options.initializing = function(renderer, liveData) {
    // Bring into the closure
    render = function() {
      renderer();
      isDirty = false;
    };
    data = liveData;

    if(typeof oldInitializing === 'function') {
      return oldInitializing.apply(this, arguments);
    }
  };

  return options;
};
