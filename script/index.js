/**
 *
 * Author: songyaru | songyaru9@gmail.com
 * Date: 2017/6/8  18:40
 *
 */
var args = process.argv.splice(2);
var name = args[0] || "React";
var fs = require("fs");
var getDependency = require("./getDependency");
var combineFile = require("./combineFile");
var genCatalog = require("./genCatalog");
var writeFile = require("./writeFile");

var dependency = getDependency(name);//扫描文件获取依赖目录

var content = combineFile(name, dependency);//拼接文件

var catalog = genCatalog(name, dependency);//生成目录信息


writeFile(catalog + "\n" + content, "./build/" + name + ".md");//输出文件

// writeFile(JSON.stringify(dependency), "./build/dependency.json");

