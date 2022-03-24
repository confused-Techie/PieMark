var { Reader } = require("./reader.js");
var match = require("./match.js");
var { Stack } = require("./stack.js");

function parse(source) {
  var reader = new Reader(source);
  var stack = new Stack();

  while (reader.getIdx < reader.docLength) {

    if (match.isClassicChar(reader.char)) {
      //  this means its a classic alpha numeric character and we want to push it to the stack, as text
      switch(stack.getLastSiblingType) {
        case 'link-destination':
          stack.addNode({ value: reader.char, type: 'link-destination' });
          reader.next();
          break;
        case 'image-destination':
          stack.addNode({ value: reader.char, type: 'image-destination' });
          reader.next();
          break;
        default:
          stack.addNode({ value: reader.char, type: 'text' });
          reader.next();
          break;
      }
    } else if (match.charMatch[reader.char] !== undefined) {
      match.charMatch[reader.char](stack, reader);
    } else {
      // no values to match. to avoid throwing away any values, we will put them into the AST
      stack.addNode({ value: reader.char, type: 'unknown' });
      reader.next();
    }
  }

  return stack.getStack();
}

module.exports = {
  parse,
};
