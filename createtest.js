
/*
/ First keep in mind to run the following command to get the dependency needed to build this JSON.
/ But other than that initial build, the dependency will not be included in the project to reduce bloat.
/ npm install commonmark-spec --save-dev
*/
var commonmark = require("commonmark-spec");
var fs = require('fs');

if (typeof commonmark === undefined) {
  console.log('Read Source File "createtest.js" for documentation on installing dependencies before running command.');
  process.exit(1);
}

var test = commonmark.tests;

fs.writeFileSync('./commonmark-spec.json', JSON.stringify(test, null, 2), "utf-8");

console.log('Done creating tests.');
