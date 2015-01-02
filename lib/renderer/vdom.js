var vdom = require('virtual-dom');
// var observe = require('observe-js');

var _ = require('../utils');
var Renderer = require('./base');
var Context = require('../context');

var VDomRenderer = _.inherit(Renderer, {
  renderers: {
    comment: function () {
      return null;
    },

    directive: function () {
      return null;
    },

    text: function (dom, context) {
      return context.evaluate(dom.data);
    },

    script: function () {
      return this.tag.apply(this, arguments);
    },

    tag: function (dom, context) {
      var children = this.list(dom.children || [], context);
      var attributes = {};
      var h = dom.name;

      _.each(dom.attribs, function (value, name) {
        if(name === 'class') {
          h += '.' + value;
        } else if(name === 'id') {
          h += '#' + value;
        } else {
          attributes[name] = context.evaluate(value);
        }
      });

      return vdom.h(h, attributes, children);
    },

    list: function (dom, context) {
      var self = this;
      return this.join(dom.map(function (current) {
        return self[current.type](current, context);
      }));
    },

    join: function (elements) {
      if (!Array.isArray(elements)) {
        return elements;
      }

      var result = [];
      elements.forEach(function (node) {
        // Context switches (e.g for-each) can produce an array of nodes
        if (Array.isArray(node)) {
          result.push.apply(result, node);
        } else {
          result.push(node);
        }
      });

      return result;
    }
  }
});

module.exports = function(content) {
  var renderer = new VDomRenderer(_.parseHtml(content, {
    ignoreWhitespace: true
  }));

  var placeholder = vdom.h('div', { style: { display: 'none' } });
  var fragment = document.createDocumentFragment();
  var updaters = [];

  var result = function(data) {
    var nodes = renderer.render(new Context(data));
    var makeUpdater = function(tree) {
      var currentTree = tree || placeholder;
      var node = vdom.create(currentTree);

      fragment.appendChild(node);

      return function(newTree) {
        newTree = newTree || placeholder;

        var patches = vdom.diff(currentTree, newTree);
        node = vdom.patch(node, patches);
        currentTree = newTree;

        return node;
      };
    };

    nodes.forEach(function(tree, index) {
      if(!updaters[index]) {
        updaters.push(makeUpdater(tree));
      } else {
        updaters[index](tree);
      }
    });

    return fragment;
  };

  result.renderer = renderer;
  return result;

  //var trees, rootNodes, observers = {};
  //var isDirty = false;
  //var rerender = function(data) {
  //  if(!isDirty) {
  //    var r = function() {
  //      result(data);
  //      isDirty = false;
  //    };
  //
  //    isDirty = true;
  //
  //    if(window.requestAnimationFrame) {
  //      window.requestAnimationFrame(r);
  //    } else {
  //      setTimeout(r, 20);
  //    }
  //  }
  //};
  //
  //var result = function(data) {
  //  var context = new Context(data, function(path) {
  //    path = path.join('.');
  //
  //    if(!observers[path]) {
  //      var observer = observers[path] = new observe.PathObserver(data, path);
  //      observer.open(function() {
  //        rerender(data);
  //      });
  //    }
  //  });
  //
  //  if(!trees) {
  //    trees = renderer.render(data);
  //    rootNodes = trees.map(vdom.create.bind(vdom));
  //  } else {
  //    var newTrees = renderer.render(data);
  //
  //    newTrees.forEach(function(newTree, index) {
  //      var patches = vdom.diff(trees[index], newTree);
  //
  //      rootNodes[index] = vdom.patch(rootNodes[index], patches);
  //      trees[index] = newTree;
  //    });
  //  }
  //
  //  return rootNodes;
  //};
  //
  //result.renderer = renderer;
  //return result;
};

module.exports.Renderer = VDomRenderer;
