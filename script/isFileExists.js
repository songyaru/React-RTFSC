var getPath = require("./getPath");
var fs = require("fs");
var isFileExists = function (fileName) {
  // return true;
  return fs.existsSync(getPath(fileName));
};

module.exports = isFileExists;