class Stack {
  constructor() {
    this.stack = { type: 'root', children: [] };
    this.CurNode = this.stack.children;
    this.CurNodeObj = this.stack;
    this.subNodeTypes = [ 'text', 'strong_emphasis', 'emphasis' ];
  }
  addNode(props) {
    // we do want to ensure that the node being added is not a subnode
    if (this.isRootNode() && this.subNodeTypes.includes(props.type)) {
      // If we are on the root node, but the type passed is a sub node, we will create our own node, and add to that instead.
      switch (props.type) {
        case 'text':
        case 'strong_emphasis':
        case 'emphasis':
          this.CurNode.push({ type: 'Paragraph', children: [], parentType: 'root', parentNode: null });
          this.DescendNode();
          this.CurNode.push({ ...props, parentType: 'Paragraph', parentNode: this.CurNodeObj });
          break;
      }
    } else if (this.getLastSiblingType == props.type) {
      // this takes over the cleanNode functions, and will automatically combine same typed sibling nodes.
      this.CurNode[this.CurNode.length -1].value += props.value;
    }  else {
        this.CurNode.push({ ...props, parentType: this.CurNodeObj.type, parentNode: this.CurNodeObj });
    }
  }
  modifyNode(props) {
    // this is used to modify the parent node of any given item. Initially made to help insert details into objects like Inline Links
  }
  DescendNode() {
    let NodeCopy = this.CurNodeObj;

    this.CurNodeObj = this.CurNode[this.CurNode.length -1];
    this.CurNode = this.CurNode[this.CurNode.length -1].children;
    this.CurNodeObj.parentNode = NodeCopy;
  }
  PopNode() {
    this.CurNode = this.stack.children;
    this.CurNodeObj = this.stack;
  }
  ClimbNode() {
    let tmpNodeCopy = this.CurNodeObj;
    this.CurNode = tmpNodeCopy.parentNode.children;
    this.CurNodeObj = tmpNodeCopy.parentNode;
  }
  isRootNode() {
    if (this.CurNode == this.stack.children) {
      return true;
    } else {
      return false;
    }
  }
  hasSibling() {
    if (this.CurNode.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  flattenStack(passedStack) {
    try {
      if (passedStack.hasOwnProperty('children')) {
        for (var i = 0; i < passedStack.children.length; i++) {
          if (passedStack.children[i].type == 'text' && passedStack.type == 'link-text' && passedStack.parentNode.type == 'link') {
            passedStack.parentNode.value = passedStack.children[i].value;
            this.flattenStack(passedStack.children[i]);
          } else if (passedStack.children[i].type == 'link-destination' && passedStack.type == 'link-details' && passedStack.parentNode.type == 'link') {
            passedStack.parentNode.url = passedStack.children[i].value;
            this.flattenStack(passedStack.children[i]);
          } else if (passedStack.children[i].type == 'text' && passedStack.type == 'link-title' && passedStack.parentNode.parentNode.type == 'link') {
            passedStack.parentNode.parentNode.title = passedStack.children[i].value;
            this.flattenStack(passedStack.children[i]);
          } else {
            this.flattenStack(passedStack.children[i]);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  get getLastSiblingType() {
    if (this.hasSibling()) {
      return this.CurNode[this.CurNode.length -1].type;
    } else {
      return "";
    }
  }
  get getParentType() {
    return this.CurNodeObj.type;
  }
  getStack() {
    this.flattenStack(this.stack);
    return this.stack;
  }
}

module.exports = {
  Stack,
};
