var str ="\
var {\n\
  findCurrentUnmaskedContext,\n\
  isContextProvider,\n\
  processChildContext,\n\
} = require('ReactFiberContext');\n\
var {createFiberRoot} = require('ReactFiberRoot');\n\
var ReactFiberScheduler = require('ReactFiberScheduler');\n\
var {HostComponent} = require('ReactTypeOfWork');\n\
var {findCurrentHostFiber} = require('ReactFiberTreeReflection');\n\
var getContextForSubtree = require('getContextForSubtree');\n\
";
// var s = str.replace(/var\s([^\s]+)\s+\=[^;]+;/g, function () {
//   var args = arguments;
//   var v = args[1];
//   return "* [" + v + "](#" + v.toLowerCase() + ")\n";
// });

var s = str.replace(/var\s(?:[^\s]+)\s+\=\s+require\('(\w+)'\);/g, function () {
  var args = arguments;
  var v = args[1];
  return "* [" + v + "](#" + v.toLowerCase() + ")\n";
});


console.log(s);
