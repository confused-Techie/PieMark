const util = require('util');
async function render(ast) {

  var doc = new Document();

  await loopNode(ast, doc);

  return doc.export;
}

async function loopNode(node, doc) {
  if (node.hasOwnProperty('children')) {
    for (var subNode = 0; subNode < node.children.length; subNode++) {
      let returnNode = await matchNode(node.children[subNode]);

      await inspectNode(returnNode, node.children[subNode], doc, node);

    }
  }
}

async function inspectNode(matchNode, astNode, doc, parentNode) {
  switch(matchNode.type) {
    case 'tag':
      doc.add(matchNode.open);
      await loopNode(astNode, doc);
      doc.add(matchNode.close);
      break;
    case 'value':
      doc.add(matchNode.value);
      await loopNode(astNode, doc);
      break;
    case 'obj':
      doc.add(matchNode.value);
      break;
    case 'raw':
      doc.add(matchNode.value);
      break;
    case 'standalone-tag':
      // really the parser has been improved to where this is no longer needed. Keeping it just in case.
      // since theres no way to tell if this intended as the opening or closing tag we check that first.
      if (doc.checkQueue(matchNode.close)) {
        // the value is in the queue, this is likely the closing tag.
        doc.add(matchNode.close);
        doc.removeQueue(matchNode.close);
      } else {
        // its not in the queue, likely an opening tag.
        // but to ensure we don't add an opening tag, with no closing tag against spec, we first find out if a closing tag exists on this node.
        if (containsClosingTag(parentNode, astNode.type)) {
          // means the closing tag is there. and we can continue, otherwise, we will drop the node.
          doc.add(matchNode.open);
          doc.addQueue(matchNode.close);
        }
      }
      break;
  }
}

function containsClosingTag(astNode, tagType) {
  var tags = 0;
  for (var i = 0; i < astNode.children.length; i++) {
    if (astNode.children[i].type == tagType) {
      tags++;
    }
  }
  if (tags % 2 == 0) {
    // since there will always be the node that triggered this check, we have to find an opening and closing.
    return true;
  } else {
    return false;
  }
}

function matchNode(node) {
  switch(node.type) {

    case 'Paragraph':
      return { type: 'tag', open: "<p>", close: "</p>" };
      break;
    case 'text':
      return { type: 'value', value: node.value };
      break;
    case 'emphasis':
      return { type: 'tag', open: "<em>", close: "</em>" };
      break;
    case 'strong_emphasis':
      return { type: 'tag', open: "<strong>", close: "</strong>" };
      break;
    case 'Header':
      return { type: 'tag', open: `<h${node.depth}>`, close: `</h${node.depth}>` };
      break;
    case 'Thematic_Break':
      return { type: 'value', value: "<hr />" };
      break;
    case 'link':
      return { type: 'obj', value: `<p><a href=${typeof node.url !== 'undefined' ? `"${node.url.trim()}"` : `""`}${typeof node.title !== 'undefined' ? `title="${node.title}"` : '' }>${node.value}</a></p>` };
      break;
    case 'image':
      return { type: 'obj', value: `<img src="${node.url.trim()}" alt="${node.alt}" title="${node.title}" />` };
      break;
    case 'line-break':
      return { type: 'raw', value: '\n' };
      break;
    default:
      console.log(`Not Understood: ${node}`);
      console.log(util.inspect(node, {showHidden: false, depth: null, colors: true}));
      return "";
      break;
  }
}

class Document {
  constructor() {
    this.doc = "";
    this.queue = [];
  }
  add(value) {
    this.doc += value;
  }
  addQueue(value) {
    // This can be used for standalone nodes, that need to added after another node has been added.
    this.queue.push(value);
  }
  checkQueue(value) {
    return this.queue.includes(value);
  }
  removeQueue(value) {
    let idx = this.queue.indexOf(value);
    this.queue.splice(idx, 1);
  }
  get export() {
    return this.doc;
  }
}

module.exports = {
  render,
};
