/**
 *
 * Author: songyaru | songyaru9@gmail.com
 * Date: 2017/6/8  18:40
 *
 */
var args = process.argv.splice(2);
var name = args[0] || "React";
var withHTML = false;
if (name == "-html") {
  withHTML = true;
  name = args[1] || "React"
}

var fs = require("fs");
var getDependency = require("./getDependency");
var combineFile = require("./combineFile");
var genCatalog = require("./genCatalog");
var writeFile = require("./writeFile");

if (!fs.existsSync("./build/")) {
  fs.mkdirSync("./build/");
}

var dependency = getDependency(name);//扫描文件获取依赖目录

var content = combineFile(name, dependency);//拼接文件

var catalog = genCatalog(name, dependency);//生成目录信息

var sourceString = catalog + "\n" + content;

if (withHTML) {
  var writeHtmlFile = require("./writeHtmlFile");
  writeHtmlFile(sourceString, name, "./build/" + name + ".html");//生成 html
}

writeFile(sourceString, "./build/md/" + name + ".md");//生成 MD 文件
writeFile(JSON.stringify(dependency), "./build/dependency/" + name + ".json");//生成依赖表


