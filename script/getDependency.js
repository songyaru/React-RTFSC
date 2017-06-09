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
  var ret = dependency || {"error": {}};
  try {
    if (!ret[fileName] || !ret.error[fileName]) { //不存在或者已经扫描过的文件不再扫描
      ret[fileName] = [];
      var filePath = getPath(fileName);
      if (isFileExists(fileName)) {
        source = fs.readFileSync(filePath, "UTF-8");
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


var isRecycleDependency = function (fileName, name, dependency) {
  // 自己依赖自己 || 已经存在依赖表里 || 存在错误的依赖表里
  return dependency[fileName].includes(name) || dependency[name] != undefined || dependency.error[name]
};

var parseFileDependency = function (str, dependency, fileName) {
  var ret = dependency;
  str.replace(/(\*\s+)*\[([^\]]+)(?:\]\(\#([^\)]+)\))/g, function () {
    var args = arguments;
    var isRootDependency = (args[1] !== undefined);
    var name = args[2];
    var link = args[3];


    var needCheckRecycleDependency = false;
    if (isRootDependency) {
      if (name.toLowerCase() == link.toLowerCase()) {
        needCheckRecycleDependency = true;
      }
    } else {
      var nsArray = name.split(".");
      if (nsArray.length > 1) {
        name = name.split(".")[0];
        needCheckRecycleDependency = true;
      }
    }

    if (needCheckRecycleDependency) {
      if (!isRecycleDependency(fileName, name, dependency)) {
        ret[fileName].push(name);
        if (isFileExists(name)) {
          ret = getDependency(name, ret);
        } else {
          ret.error[name] = true;
        }
      }
    }

  });
  return ret;
};

module.exports = getDependency;