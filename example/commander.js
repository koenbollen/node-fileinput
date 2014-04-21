
var program = require('commander');
var fileinput = require('../');

program.version('0.0.1')
  .description('count bytes/lines in files - commander fileinput example')
  .usage('[options] [file...]')
  .option('-l, --lines', 'count lines')
  .option('-c, --bytes', 'count bytes')
  .parse(process.argv);

var lines = 0;
var bytes = 0;

fileinput.input(program)
  .on('line', function(line) {

    lines += 1;
    bytes += line.length;

  })
  .on('end', function() {

    if(program.lines) {
      console.log(lines);
    } else if(program.bytes) {
      console.log(bytes);
    } else {
      console.log(lines, bytes);
    }

  });
