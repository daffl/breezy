var vdom = require('virtual-dom');
var HtmlRenderer = require('./html');
var VDomRenderer = require('./vdom');

exports.html = function(dom) {
  var r = new HtmlRenderer(dom);
  var result = function(data) {
    return r.render(data);
  };

  result.renderer = r;
  return result;
};

exports.vdom = function(dom) {
  var renderer = new VDomRenderer(dom);
  var VNode = require('virtual-dom/vnode/vnode');

  var tree, rootNode;
  var result = function(data) {
    if(!tree) {
      var children = renderer.render(data);
      tree = new VNode('div', {}, children);
      rootNode = vdom.create(tree);
    } else {
      var newTree = new VNode('div', {}, renderer.render(data));
      var patches = vdom.diff(tree, newTree);

      rootNode = vdom.patch(rootNode, patches);
      tree = newTree;
    }

    return rootNode;
  };

  result.renderer = renderer;

  return result;
};
