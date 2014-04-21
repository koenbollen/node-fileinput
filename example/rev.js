
var fileinput = require('../');

// rev.js - Output files or stdin in reversed order (like man rev)

fileinput.input()
  .on('line', function(line) {
    if(line[line.length-1] == 0xA) {
      line = line.slice(0, line.length-1);
    }
    var arr = Array.prototype.reverse.call(new Uint8Array(line));
    process.stdout.write(new Buffer(arr));
    process.stdout.write('\n');
  });
