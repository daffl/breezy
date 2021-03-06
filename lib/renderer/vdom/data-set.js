// See https://github.com/Raynos/virtual-hyperscript/blob/master/hooks/data-set-hook.js
var DataSet = require("data-set");

module.exports = DataSetHook;

function DataSetHook(value) {
  if (!(this instanceof DataSetHook)) {
    return new DataSetHook(value);
  }

  this.value = value;
}

DataSetHook.prototype.hook = function (node, propertyName) {
  var ds = DataSet(node);
  ds[propertyName] = this.value;
};
