
var FileInput = require('./lib/fileinput').FileInput;

exports.FileInput = FileInput;
exports.DEFAULT_BUFSIZE = 8*1024;

var instance = null;

exports.input = function input(files, bufsize, flags) {
  if(instance != null) {
    throw new Error('.input() already active, create an normal FileInput instance instead.');
  }
  instance = new FileInput(files, bufsize, flags);
  return instance;
};

exports.readline = function readline(callback) {
  if(instance == null) {
    throw new Error('no active .input() found, call `fileinput.input()` first.');
  }
  return instance.readline(callback);
};

exports.filename = function filename() {
  if(instance == null) {
    throw new Error('no active .input() found, call `fileinput.input()` first.');
  }
  return instance.filename();
};
exports.fileno = function fileno() {
  if(instance == null) {
    throw new Error('no active .input() found, call `fileinput.input()` first.');
  }
  return instance.fileno();
};
exports.lineno = function lineno() {
  if(instance == null) {
    throw new Error('no active .input() found, call `fileinput.input()` first.');
  }
  return instance.lineno();
};
exports.filelineno = function filelineno() {
  if(instance == null) {
    throw new Error('no active .input() found, call `fileinput.input()` first.');
  }
  return instance.filelineno();
};
exports.isfirstline = function isfirstline() {
  if(instance == null) {
    throw new Error('no active .input() found, call `fileinput.input()` first.');
  }
  return instance.isfirstline();
};
exports.isstdin = function isstdin() {
  if(instance == null) {
    throw new Error('no active .input() found, call `fileinput.input()` first.');
  }
  return instance.isstdin();
};
