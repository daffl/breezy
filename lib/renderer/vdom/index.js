var vdom = require('virtual-dom');
var _ = require('../../utils');
var Context = require('../../context');
var VDomRenderer = require('./renderer');
var makeLive = require('./live');
var parser = require('../../parser');

module.exports = function(content, options) {
  options = options || {};

  // Check if we want observable objects
  if(typeof options.PathObserver === 'undefined') {
    options.PathObserver =  typeof window !== 'undefined' && window.PathObserver;
  }

  if(options.PathObserver) {
    options = makeLive(options);
  }

  var html = content.outerHTML ? content.outerHTML : content;
  var renderer = new VDomRenderer(parser(html, {
    ignoreWhitespace: true
  }));
  var fragment = document.createDocumentFragment();
  // Create a DOM node and adds it to the document fragment
  var makeUpdater = function(tree) {
    var currentTree = tree;
    var node = vdom.create(currentTree);

    fragment.appendChild(node);

    // Return a renderer that diffs the old with the new tree
    // and patches the DOM node we created before
    return function(newTree) {
      var patches = vdom.diff(currentTree, newTree);
      node = vdom.patch(node, patches);
      currentTree = newTree;

      return node;
    };
  };
  var updaters, liveData;
  var result = function(data) {
    // We do not allow rendering with different data (since that is probably not what you want)
    if(liveData && data && data !== liveData) {
      throw new Error('Virtual DOM renderer already initialized with different data. ' +
      'Call the renderer without arguments to update the existing DOM elements.');
    }

    if(!liveData && typeof options.initializing === 'function') {
      options.initializing(result, data);
    }

    var nodes = renderer.render(new Context(data || liveData, options.read));

    if(!updaters) { // Initialize the initial VTrees and create actual DOM nodes
      liveData = data;
      updaters = nodes.map(makeUpdater);
      // If we got passed a DOM node, we replace it with the the live-rendered output
      if(_.isDomNode(content)) {
        content.parentNode.replaceChild(fragment, content);
      }

      return fragment;
    } else { // Data are live
      // Run each updater function which diffs the virtual trees and updates the DOM node
      // with the newly rendered VTree
      updaters.forEach(function(update, index) {
        update(nodes[index]);
      });

      return result;
    }
  };

  result.renderer = renderer;
  return result;
};

module.exports.Renderer = VDomRenderer;
