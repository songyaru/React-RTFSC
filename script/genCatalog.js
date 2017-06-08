var genCatalog = function (fileName, dependence) {
  return "# 目录 \n" + getCatalog(fileName, dependence, 1);
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
  var source = space(level) + "* [" + fileName + "](#" + fileName.toLowerCase() + ")\n";
  for (var i = 0, len = dependencyFileArray.length; i < len; i++) {
    var dependencyFile = dependencyFileArray[i];
    source += getCatalog(dependencyFile, dependency, level + 1);
  }
  return source;
};


module.exports = genCatalog;