var Parser = require('./parser');
var textCache = {};
var expressionCache = {};

// Either get the path value from the context or return the nodes literal value
var getValue = function(node, context) {
  return node.type === 'path' ? context.value(node.value) : node.value;
};
// Evaluators for different types of parse nodes
var evaluators = {
  expression: function(node) {
    return function(context) {
      // The get the context for the path (which can be different)
      var pathContext = context.get(node.path);
      var result = pathContext.value();

      if(typeof result === 'function') {
        var args = node.args.map(function(arg) {
          return getValue(arg, context);
        });
        var ctx = pathContext.parent ? pathContext.parent.value() : null;

        // Use the path context as the function context
        result = result.apply(ctx, args);
      }

      // If the expression has a `? 'truthy'` section and there is a truthy result
      if(result && node.truthy) {
        result = getValue(node.truthy, context);
      }

      // If the expression has a `: 'falsy'` section and there is a falsy result
      if(!result && node.falsy) {
        result = getValue(node.falsy, context);
      }

      // falsy values should result in an empty string
      return result;
    };
  }
};
// Return the node evaluator or the nodes value
var getEvaluator = function(node) {
  if(evaluators[node.type]) {
    return evaluators[node.type](node);
  }

  return node.value;
};

// Returns a renderer that can be passed a context and will return
// the expression result for the given text
exports.text = function(text) {
  if(!textCache[text]) {
    var parsed = Parser.parse(text);
    var evaluators = parsed.map(getEvaluator);

    textCache[text] = function(context) {
      return evaluators.map(function(cur) {
        return typeof cur === 'function' ? cur(context) : cur;
      }).join('');
    };
  }

  return textCache[text];
};

exports.expression = function(expression) {
  if(!expressionCache[expression]) {
    var node = Parser.parse(expression, { startRule: 'expression' });
    expressionCache[expression] = getEvaluator(node);
  }
  return expressionCache[expression];
};
