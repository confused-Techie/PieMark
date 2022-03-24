var ast = require("./ast.js");
var renderer = require("./renderer.js");
var file_handles = require("./file_handles.js");
const { Buffer } = require('buffer');

const testArray = [
  {
    name: "Asterisk Strong: Valid",
    action: "Asterisk Left & Right Double Delimitter",
    ast: false,
    in: "**Test**\n",
    out: "<p><strong>Test</strong></p>\n"
  },
  {
    name: "Asterisk Em: Valid",
    action: "Asterisk Left & Right Single Delimitter",
    ast: false,
    in: "*Test*\n",
    out: "<p><em>Test</em></p>\n"
  },
  {
    name: "Asterisk Strong: Invalid",
    action: "Asterisk Left Double Delimitter",
    in: "**Test\n",
    out: "<p>**Test</p>\n"
  },
  {
    name: "Asterisk Strong: Invalid",
    action: "Asterisk Right Double Delimitter",
    in: "Test**\n",
    out: "<p>Test**</p>\n"
  },
  {
    name: "Underscore Em: Valid",
    action: "Underscore Left & Right Single Delimitter",
    ast: false,
    in: "_Test_\n",
    out: "<p><em>Test</em></p>\n"
  },
  {
    name: "Underscore Strong: Valid",
    action: "Underscore Left & Right Double Delimitter",
    ast: false,
    in: "__Test__\n",
    out: "<p><strong>Test</strong></p>\n"
  },
  {
    name: "Underscore Thematic Break: Valid",
    action: "Underscore 3 Characters",
    ast: false,
    in: "___\n",
    out: "<hr />\n"
  },
  {
    name: "Thematic Breaks: Valid",
    action: "CommonMark Thematic Breaks 43",
    ast: false,
    in: "***\n---\n___\n",
    out: "<hr />\n<hr />\n<hr />\n"
  },
  {
    name: "Thematic Breaks: Valid",
    action: "CommonMark Thematic Breaks 44",
    ast: false,
    in: "+++\n",
    out: "<p>+++</p>\n"
  },
  {
    name: "Thematic Breaks: Valid",
    action: "CommonMark Thematic Breaks 45",
    ast: false,
    in: "===\n",
    out: "<p>===</p>\n"
  },
  {
    name: "Thematic Breaks: Valid",
    action: "CommonMark Thematic Breaks 46 (Modified)",
    ast: false,
    in: "--\n**\n__\n",
    out: "<p>--</p>\n<p>**</p>\n<p>__</p>\n"
  },
  {
    name: "Generic Text",
    action: "Generic Text",
    ast: false,
    in: "Hello World\n",
    out: "<p>Hello World</p>\n"
  },
  {
    name: "Thematic Breaks: Valid",
    action: "CommonMark Thematic Breaks 50",
    ast: false,
    in: "_____________________\n",
    out: "<hr />\n"
  },
  {
    name: "Link: Valid",
    action: "CommonMark Link 482",
    ast: false,
    in: "[link](/uri)\n",
    out: "<p><a href=\"/uri\">link</a></p>\n"
  },
  {
    name: "Link: Valid",
    action: "CommonMark Link 484",
    ast: false,
    in: "[link]()\n",
    out: "<p><a href=\"\">link</a></p>\n"
  }
];

/*
/ In test definitions, ast true, means to test the AST output, AST false, means to test the rendered output.
*/

async function startTests() {
  var score = new Score(testArray.length);

  console.log(`Total Tests: ${score.total}`);
  console.log("====================");

  for (var i = 0; i < score.total; i++) {
    try {
      var input = testArray[i].in;

      if (testArray[i].ast) {
        var res = await ast.parse(input);
        checkRes(testArray[i], res, score);
      } else {
        var tmpres = await ast.parse(input);
        var res = await renderer.render(tmpres);
        checkRes(testArray[i], res, score);
      }
    } catch(err) {
      score.failAdd();
      logFail(testArray[i].name, testArray[i].action, err, testArray[i].out);
    }
  }

  console.log("====================");
  console.log(`=== Test Results ===`);
  console.log(`Out of ${score.total}:`);
  console.log(`${score.pass} Passed`);
  console.log(`${score.fail} Failed`);
}

function checkRes(node, res, score) {
  if (node.out == res) {
    score.passAdd();
    logPass(node.name, node.action);
  } else {
    score.failAdd();
    logFail(node.name, node.action, res, node.out);
  }
}

function logFail(name, action, why, expected) {
  console.log(`Test ${name} failed to ${action}. Because of the below...`);
  console.log('Expected: ...');
  console.log(expected);
  console.log('Got: ...');
  console.log(why);
}

function logPass(name, action) {
  console.log(`Test ${name} passed while testing ${action}...`);
}

class Score {
  constructor(total) {
    this.passed = 0;
    this.failed = 0;
    this.totalTest = total;
  }
  passAdd() {
    this.passed++;
  }
  failAdd() {
    this.failed++;
  }
  get pass() {
    return this.passed;
  }
  get fail() {
    return this.failed;
  }
  get total() {
    return this.totalTest;
  }
}

// then to call the script.

startTests();
