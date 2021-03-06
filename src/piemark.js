const util = require('util');

const file_handles = require("./file_handles.js");
const ast = require("./ast.js");
const renderer = require("./renderer.js");

async function run(rawArguments) {
  if (typeof rawArguments[0] === "undefined" || rawArguments[0] == "") {
    console.log('No source file specified.');
    process.exitCode = 1;
  }

  var astOnly = typeof rawArguments[1] !== null ? rawArguments[1] : false;

  var source = await file_handles.readfile(rawArguments[0]);

  var astTree = await ast.parse(source);

  if (astOnly) {
    console.log('ast only');
    var astWrite = await file_handles.writefile(JSON.stringify(astTree, file_handles.replacerFunc(), 2), 'astTree.json');
    console.log(astWrite);
  } else {
    var render = await renderer.render(astTree);
    console.log(util.inspect(render, {showHidden: false, depth: null, colors: true}));
  }
}

module.exports = {
  run,
};
