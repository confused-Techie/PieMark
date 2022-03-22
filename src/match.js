const charMatch = {
  '\n'(stack, reader) {
    stack.PopNode();
    reader.next();
  },
  '\r'(stack, reader) {
    reader.next();
  },
  '#'(stack, reader) {

    var { count, originalString } = reader.MatchAhead('#');

    if (count >= 7) {
      // While originally this was a manual cap, seems according to CommonMark Spec, it is instead now text
      stack.addNode({ type: 'text', value: originalString });
    } else if (/[\S]/gm.test(reader.peekAhead())) {
      // if the next character is not the required whitespace after a heading, then again it is text
      stack.addNode({ type: 'text', value: originalString });
    } else {
      stack.addNode({ type: 'Header', children: [], depth: count });
      stack.DescendNode();
    }

    reader.next();
  },
  '*'(stack, reader) {
    var { count, originalString } = reader.MatchAhead('*');

    switch(count) {
      case 2:
        if (reader.hasChar('*', [ '\n' ]) && stack.getParentType != 'strong_emphasis') {
          stack.addNode({ type: 'strong_emphasis', children: [] });
          stack.DescendNode();
          reader.next();
        } else if (stack.getParentType == 'strong_emphasis') {
          stack.ClimbNode();
          reader.next();
        } else {
          stack.addNode({ value: originalString, type: 'text' });
          reader.next();
        }
        break;
      case 1:
        if (reader.hasChar('*', [ '\n' ]) && stack.getParentType != 'emphasis') {
          stack.addNode({ type: 'emphasis', children: [] });
          stack.DescendNode();
          reader.next();
        } else if (stack.getParentType == 'emphasis') {
          stack.ClimbNode();
          reader.next();
        } else {
          stack.addNode({ value: originalString, type: 'text' });
          reader.next();
        }
        break;
    }
    if (count >= 3) {
      stack.addNode({ type: 'Thematic_Break', kind: '*' });
      reader.next();
    }
  },
  '_'(stack, reader) {
    var { count, originalString } = reader.MatchAhead('_');

    switch(count) {
      case 2:
        if (reader.hasChar('_', [ '\n' ]) && stack.getParentType != 'strong_emphasis') {
          stack.addNode({ type: 'strong_emphasis', children: [] });
          stack.DescendNode();
          reader.next();
        } else if(stack.getParentType == 'strong_emphasis') {
          stack.ClimbNode();
          reader.next();
        } else {
          stack.addNode({ value: '_', type: 'text' });
          reader.next();
        }
        break;
      case 1:
        if (reader.hasChar('_', [ '\n' ]) && stack.getParentType != 'emphasis') {
          stack.addNode({ type: 'emphasis', children: [] });
          stack.DescendNode();
          reader.next();
        } else if (stack.getParentType == 'emphasis') {
          stack.ClimbNode();
          reader.next();
        } else {
          stack.addNode({ value: '_', type: 'text' });
          reader.next();
        }
        break;
    }
    if (count >= 3) {
      stack.addNode({ type: 'Thematic_Break', kind: '_' });
      reader.next();
    }
  },
  '-'(stack, reader) {
    var { count, originalString } = reader.MatchAhead('-');

    if (count >= 3) {
      stack.addNode({ type: 'Thematic_Break', kind: '-' });
    } else {
      stack.addNode({ value: originalString, type: 'text' });
    }
    reader.next();
  },
  '\\'(stack, reader) {
    // since this is used to escape the next character, we will just put in the next character as text.
    stack.addNode({ value: reader.next(), type: 'text' });
    reader.next();
  },
  '['(stack, reader) {
    if (reader.hasChar(']', [ '\n', '[' ]) && reader.hasChar('(', [ '\n' ]) && reader.hasChar(')', [ '\n' ])) {
      stack.addNode({ type: 'link', children: [] });
      stack.DescendNode();
      stack.addNode({ type: 'link-text', children: [] });
      stack.DescendNode();
      reader.next();
    } else {
      stack.addNode({ value: '[', type: 'text' });
      reader.next();
    }
  },
  ']'(stack, reader) {
    if (stack.getParentType == 'link-text') {
      stack.ClimbNode();
      reader.next();
    } else {
      stack.addNode({ value: ']', type: 'text' });
      reader.next();
    }
  },
  '('(stack, reader) {
    // since to make this a proper link it must be following '[]' with no whitespaces, we can check last sibling.
    if (stack.getParentType == 'link') {
      stack.addNode({ type: 'link-details', children: [] });
      stack.DescendNode();
      reader.next();
    } else {
      stack.addNode({ value: '(', type: 'text' });
      reader.next();
    }
  },
  ')'(stack, reader) {
    if (stack.getParentType == 'link-details') {
      stack.ClimbNode();
      reader.next();
    } else {
      stack.addNode({ value: ')', type: 'text' });
      reader.next();
    }
  },
  '/'(stack, reader) {
    if (stack.getParentType == 'link-details') {
      stack.addNode({ value: '/', type: 'link-destination' });
      reader.next();
    } else {
      stack.addNode({ value: '/', type: 'text' });
      reader.next();
    }
  },
  '"'(stack, reader) {
    if (stack.getParentType == 'link-details' && reader.hasChar('"', [ '\n' ])) {
      stack.addNode({ type: 'link-title', children: [] });
      stack.DescendNode();
      reader.next();
    } else if (stack.getParentType == 'link-title') {
      stack.ClimbNode();
      reader.next();
    } else {
      stack.addNode({ value: '"', type: 'text' });
      reader.next();
    }
  },
};

function isClassicChar(character) {
  const regex = /[a-zA-Z0-9\. ]/gm;
  return regex.test(character);
}

module.exports = {
  charMatch,
  isClassicChar,
};
