/**
 * Breezy text parsing grammar
 * ===========================
 *
 * A grammar for parsing text like `some content {{helpers.eq first "test" ? 'active' : 'inactive'}}`
 * into plain text and expressions using [PEGjs](http://pegjs.org).
 * Will generate `lib/expression/parser.js`
 *
 */

// Matches any number of text or expressions enclosed with `{{` and `}}`
start = (text / expression)*

// Any text that does not contain an expression matcher (`{{`)
text =
  chars:(!(open) c:any { return c; })+ {
    return {
        type: 'text',
        value: chars.join('')
    }
  }

// Main expression e.g. `helpers.eq first "test" ? 'active' : 'inactive'`
expression =
  open ws* main:path args:(ws+ a:argument { return a; })* truthy:truthy falsy:falsy ws* close {
    return {
      type: 'expression',
      path: main.value,
      args: args,
      truthy: truthy || null,
      falsy: falsy || null
    }
  }

// A method call argument can either be a path or a string
argument =
  path /
  string

// Dot separated paths like `single` or `path.to.value` will be split into an array
path =
  first:variable rest:("." s:variable { return s; })* {
    return {
      type: 'path',
      value: [first].concat(rest)
    };
  }

// Result for truthy expression e.g. `? "something"`
truthy =
  ws+ "?" ws+ arg:argument { return arg; }
  / ""

// Result for falsy expression e.g. `: "something"`
falsy =
  ws+ ":" ws+ arg:argument { return arg; }
  / ""

// Valid variable names
variable =
  chars:[0-9a-zA-Z_\$]+ { return chars.join(''); }

// String literals with either single or double quotes
string "string" =
  doublequote chars:doublestringchar* doublequote {
    return { type: 'string', value: chars.join("") };
  }
  / singlequote chars:singlestringchar* singlequote {
    return { type: 'string', value: chars.join("") };
  }

// Breaking condition for single quoted strings
singlestringchar =
  (!singlequote) chr:character { return chr; }

// Breaking condition for double quoted strings
doublestringchar =
  (!doublequote) chr:character { return chr; }

// String characters with escaping (JSON rules)
character =
  unescaped
  / escape_sequence

// Escape sequences (\n, \", \' etc.)
escape_sequence "escape sequence" = "\\" sequence:(
     doublequote
   / singlequote
   / "\\"
   / "/"
   / "b" { return "\b"; }
   / "f" { return "\f"; }
   / "n" { return "\n"; }
   / "r" { return "\r"; }
   / "t" { return "\t"; }
   / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
       return String.fromCharCode(parseInt(digits, 16));
     }
  )
  { return sequence; }

any = .
open = "{{"
close = "}}"
ws "whitespace" = [ \t]
doublequote "double quote" = '"'
singlequote "single quote" = "'"
unescaped = [\x20-\x21\x23-\x5B\x5D-\u10FFFF]
HEXDIG = [0-9a-f]i
