/**
 *
 * Author: songyaru | songyaru9@gmail.com
 * Date: 2017/6/9  10:33
 *
 */

var fs = require("fs");
var path = require("path");

var writeFile = function (source, filePath) {

  var dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(path.dirname(filePath));
  }

  fs.writeFileSync(filePath, source);

};

module.exports = writeFile;