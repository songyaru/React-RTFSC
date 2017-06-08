/**
 *
 * Author: songyaru | songyaru9@gmail.com
 * Date: 2017/6/8  17:50
 *
 */

var fs = require("fs");
var path = require("path");
var getPath = require("./getPath");
var genCatalog = require("./genCatalog");

var combineFile = function (fileName, dependency) {
  return readDependencyFile(fileName, dependency);
};

var readDependencyFile = function (fileName, dependency) {
  if (dependency.error[fileName]) {
    return "";
  }
  var filePath = getPath(fileName);
  var dependencyFileArray = dependency[fileName];
  var source = fs.readFileSync(filePath, "UTF-8") + "\n";
  for (var i = 0, len = dependencyFileArray.length; i < len; i++) {
    var dependencyFile = dependencyFileArray[i];
    source += readDependencyFile(dependencyFile, dependency);
  }
  return source;
};


module.exports = combineFile;