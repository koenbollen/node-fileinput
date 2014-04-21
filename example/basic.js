// First line of this file!
var fileinput = require('../');

fileinput.input([__filename])
  .on('error', function(err) {
    console.error(err);
    process.exit(1);
  })
  .on('line', function(line) {
    console.log(fileinput.filelineno(), line.toString());
  })
  .on('file', function(file) {
    console.log('-- ', file + ':');
  })
  .on('end', function() {
    console.log('-- end');
  });
