/**
 *
 * Author: songyaru | songyaru9@gmail.com
 * Date: 2017/6/8  17:36
 *
 */

var fs = require("fs");
var getPath = require("./getPath");
var isFileExists = require("./isFileExists");

var getDependency = function (fileName, dependency) {
  var source = "";
  var ret = dependency || {};
  try {
    if (!ret[fileName] || !ret.error[fileName]) { //不存在或者已经扫描过的文件不再扫描
      ret[fileName] = [];
      var filePath = getPath(fileName);
      if (isFileExists(fileName)) {
        source = fs.readFileSync(filePath, "UTF-8");
        // console.log("", "   -source- ", source);
        ret = parseFileDependency(source, ret, fileName)
      } else {
        //文件不存在
        ret.error[fileName] = true;
      }
    }
  } catch (e) {
    ret.error[fileName] = true;
    console.error(e);
  }
  return ret;
};


var parseFileDependency = function (str, dependency, key) {
  var ret = dependency;
  str.replace(/(?:\*\s+\[)([^\]]+)(?:\]\(\#([^\)]+)\))/g, function () {
    var args = arguments;
    var name = args[1];
    var link = args[2];
    if (name.toLowerCase() == link.toLowerCase()) {
      ret[key].push(name);
      if (isFileExists(name)) {
        ret = getDependency(name, ret);
      } else {
        ret.error[name] = true;
      }
    }
  });
  return ret;
};

module.exports = getDependency;