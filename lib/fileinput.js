
var fs = require('fs');
var util = require('util');
var events = require('events');

var DEFAULT_BUFSIZE = 8*1024;

function bufferIndexOf( buf, val, start ) {
  if(start === undefined) {
    start = 0;
  }
  for( var i = start; i < buf.length; i++ ) {
    if(val == buf[i]) {
      return i;
    }
  }
  return -1;
};

var FileInput = function FileInput(files, bufsize, flags) {
  this._files = files || process.argv.splice(2);
  this._bufsize = bufsize || DEFAULT_BUFSIZE;
  this._flags = flags || 'r';

  this._file = null;

  this._buffer = [];
  this._bufindex = 0;
  this._remaining = null;
  this._reading = false;
  this._lineno = 0;
  this._filelineno = 0;
  this._isstdin = false;

  var self = this;
  var reading = function reading() {
    self.readline(function(err, line) {
      if(err) {
        self.emit('error', err);
        return;
      }
      if(line != '') {
        self.emit('line', line);
        reading();
      } else {
        self.emit('end');
      }
    });
  }
  this.on('newListener', function(evt, listener) {
    if((evt == 'line' || evt == 'end') && !self._reading) {
      self._reading = true;
      process.nextTick(reading);
    }
  });
};
util.inherits(FileInput, events.EventEmitter);

FileInput.prototype.readline = function readline(callback) {
  var self = this;

  if(this._bufindex < this._buffer.length && this._buffer.length > 0) {
    var line = this._buffer[this._bufindex];
    this._bufindex += 1;
    this._lineno += 1;
    this._filelineno += 1;
    process.nextTick(function() {
      callback(null, line);
    });
    return;
  }

  var self = this;
  var next = function next() {
    self._readlines(function(err, buffer) {
      if(err) return callback(err);
      self._buffer = buffer;
      self._bufindex = 0;
      if((!self._buffer || self._buffer.length == 0) && (!this._remaining || this._remaining.length == 0) ) {
        self._file = null;
      }
      self.readline(callback);
    });
  };

  if(this._file == null) {
    if(!this._files || this._files.length == 0) {
      process.nextTick(function() {
        callback(null, '');
      });
      return;
    }
    this._filename = this._files.shift();
    this._filelineno = 0;
    this._file = null;
    if(this._filename == '-') {
      // TODO: Make this work on Windows.
      this._isstdin = true;
      this._filename = '<stdin>';
      this.emit('file', this._filename);
      fs.open('/dev/stdin', this._flags, function(err, fd) {
        if(err) return callback(err);
        self._file = fd;
        next();
      });
    } else {
     this._isstdin = false;
      this.emit('file', this._filename);
      fs.open(this._filename, this._flags, function(err, fd) {
        if(err) return callback(err);
        self._file = fd;
        next();
      });
    }
  } else {
    process.nextTick(next);
  }
}

FileInput.prototype._readlines = function _readlines(callback) {

  var readbuf = new Buffer(this._bufsize);

  fs.read(this._file, readbuf, 0, this._bufsize, null, function(err, bytesRead, readbuf) {
    if(err) return callback(err);

    if(bytesRead==0 && this._remaining && this._remaining.length > 0) {
      var line = this._remaining;
      this._remaining = null;
      callback(null, [line]);
      return;
    }

    readbuf = readbuf.slice(0, bytesRead);
    if(this._remaining && this._remaining.length > 0) {
      readbuf = Buffer.concat([this._remaining, readbuf]);
    }
    var result = [];
    var index = bufferIndexOf( readbuf, 0xA );
    var last = 0;
    while( index != -1 ) {
      var line = readbuf.slice(last, index+1);
      last = index+1;
      index = bufferIndexOf( readbuf, 0xA, last );
      result.push(line);
    }
    this._remaining = readbuf.slice(last);
    callback(null, result);
  });

};

FileInput.prototype.filename = function filename() {
  return this._filename;
};
FileInput.prototype.fileno = function fileno() {
  return this._fileno;
};
FileInput.prototype.lineno = function lineno() {
  return this._lineno;
};
FileInput.prototype.filelineno = function filelineno() {
  return this._filelineno;
};
FileInput.prototype.isfirstline = function isfirstline() {
  return this._filelineno == 0;
};
FileInput.prototype.isstdin = function isstdin() {
  return this._isstdin;
};

exports.FileInput = FileInput;
exports.DEFAULT_BUFSIZE = DEFAULT_BUFSIZE;
