var genCatalog = function (fileName, dependence) {
  return /*"# 目录 \n" +*/ getCatalog(fileName, dependence, 0);
};


var space = function (num) {
  var ret = "";
  for (var i = 0; i < num - 1; i++) {
    ret += "    ";
  }
  return ret;
};

var getCatalog = function (fileName, dependency, level) {
  var dependencyFileArray = dependency[fileName] || [];
  var source = "";
  if (level) {
    source = space(level);
    if (dependency.error[fileName]) {
      // source += "* " + fileName + "\n"; //没有这个文件
      source += "* [" + fileName + "](#FIlE_NOT_FIND)\n";//没有这个文件
    } else {
      source += "* [" + fileName + "](#" + fileName.toLowerCase() + ")\n";
    }
  }

  for (var i = 0, len = dependencyFileArray.length; i < len; i++) {
    var dependencyFile = dependencyFileArray[i];
    source += getCatalog(dependencyFile, dependency, level + 1);
  }
  return source;
};


module.exports = genCatalog;