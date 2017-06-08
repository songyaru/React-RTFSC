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
var mkDir = require("./mkdir");

var dependency = getDependency(name, {"error": {}});
// console.log("", "   -dependency- ", dependency);
var content = combineFile(name, dependency);

var catalog = genCatalog(name, dependency);


var outDir = "./build/";
mkDir(outDir);
var destFile = outDir + name + ".md";
fs.writeFileSync(destFile, catalog + "\n" + content);

