var Parser = require('./parser');
var textCache = {};
var expressionCache = {};

// Either get the path value from the context or return the nodes literal value
// If the path value is a function, call it.
var getValue = function(node, context) {
  if(node.type !== 'path') {
    return node.value;
  }

  return context.value(node.value);
};

// Evaluators for different types of parse nodes
var evaluators = exports.evaluators = {
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
      } else if(node.args.length) {
        // TODO throw error or warning?
        result = null;
      }

      // If the expression has a falsy result
      if(!result) {
        if(node.falsy) {
          return getValue(node.falsy, context);
        } else if(node.truthy) {
          // Return undefined if there is only a truthy block
          return null;
        }

        return result;
      }

      // If the expression has a `? 'truthy'` section and there is a truthy result
      if(node.truthy) {
        return getValue(node.truthy, context);
      } else if(node.falsy) {
        // Return undefined if there is only a falsy block
        return null;
      }

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

// Returns a renderer function for the given text that can be passed a context and which
// will return the rendered text.
exports.text = function(text) {
  if(!textCache[text]) {
    var parsed = Parser.parse(text);
    var evaluators = parsed.map(getEvaluator);

    textCache[text] = function(context) {
      var text = '';
      evaluators.forEach(function(evaluator) {
        var result = typeof evaluator === 'function' ? evaluator(context) : evaluator;
        text += !result && result !== 0 ? '' : result;
      });
      return text;
    };
  }

  return textCache[text];
};

// Returns a function for an expression (e.g. `helpers.eq first "test" ? 'active' : 'inactive'`)
// that returns the expressions result when called with a context.
exports.expression = function(expression) {
  if(!expressionCache[expression]) {
    var node = Parser.parse(expression, { startRule: 'expression' });
    expressionCache[expression] = getEvaluator(node);
  }
  return expressionCache[expression];
};
