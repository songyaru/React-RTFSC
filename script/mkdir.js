var fs = require('fs');

var path = require('path');

var makeDirSync = function (p, mode, made) {
  if (mode === undefined) {
    mode = 0777 & (~process.umask());
  }
  if (!made) {
    made = null;
  }

  if (typeof mode === 'string') {
    mode = parseInt(mode, 8);
  }
  p = path.resolve(p);
  made = made || p;

  try {
    fs.mkdirSync(p, mode);
  } catch (err0) {
    switch (err0.code) {
      case 'ENOENT' :
        made = makeDirSync(path.dirname(p), mode, made);
        makeDirSync(p, mode, made);
        break;

      default:
        var stat;
        try {
          stat = fs.statSync(p);
        } catch (err1) {
          throw err0;
        }
        if (!stat.isDirectory()) {
          throw err0;
        }
        break;
    }
  }
};

module.exports = makeDirSync;


