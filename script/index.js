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
var dependency = getDependency(name, {"error": {}});
// console.log("", "   -dependency- ", dependency);
var content = combineFile(name, dependency);

var catalog = genCatalog(name, dependency);


writeFile(catalog + "\n" + content, "./build/" + name + ".md");

