var str ="\
var ReactDOMFrameScheduling = require('ReactDOMFrameScheduling');\
var ReactDOMInjection = require('ReactDOMInjection');\
var ReactGenericBatching = require('ReactGenericBatching');\
var ReactFiberReconciler = require('ReactFiberReconciler');\
var ReactInputSelection = require('ReactInputSelection');\
var ReactInstanceMap = require('ReactInstanceMap');\
var ReactPortal = require('ReactPortal');\
var ReactVersion = require('ReactVersion');\
var {isValidElement} = require('react');\
var {injectInternals} = require('ReactFiberDevToolsHook');\
";
var s = str.replace(/var\s([^\s]+)\s+\=[^;]+;/g, function () {
  var args = arguments;
  var v = args[1];
  return "* [" + v + "](#" + v.toLowerCase() + ")\n";
});

console.log(s);