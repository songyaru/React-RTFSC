var writeFile = require("./writeFile");
var showdown = require('showdown');

var converter = new showdown.Converter();

//TODO 优化 css 格式

var htmlTemplate = '\
<!DOCTYPE html>\n\
<html>\n\
<head>\n\
  <meta charset="UTF-8">\n\
  <title>$$name$$</title>\n\
  <link rel="stylesheet" type="text/css" href="../resource/index.css">\n\
  <link rel="stylesheet" href="../resource/github.css">\n\
  <script src="../resource/highlight.min.js"></script>\n\
  <script>hljs.initHighlightingOnLoad();</script>\n\
</head>\n\
<body class="markdown">\n\
$$content$$\n\
</body>\n\
</html>\
';

var writeHtmlFile = function (content, fileName, filePath) {
  var html = htmlTemplate.replace(/\$\$name\$\$/g, fileName).replace(/\$\$content\$\$/g, converter.makeHtml(content));
  writeFile(html, filePath);
};

module.exports = writeHtmlFile;

