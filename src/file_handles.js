const fs = require("fs");

function readfile(fileToRead) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileToRead, "utf8", function(err, data) {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(data);
    });
  });
}

function writefile(data, title) {
  return new Promise(function (resolve, reject) {
    try {
      fs.writeFileSync(`./${title}`, data, "utf8");
      resolve(`Successfully wrote: ${title}`);
    } catch(err) {
      reject(err);
    }
  });
}

const replacerFunc = () => {
  const visited = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (visited.has(value)) {
        return;
      }
      visited.add(value);
    }
    return value;
  };
};

module.exports = {
  readfile,
  writefile,
  replacerFunc
};
