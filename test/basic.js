// First line of this file!
var FileInput = require('../lib/fileinput').FileInput;

var fi = new FileInput(['README.md', __filename]);
fi.on('error', function(err) {
  console.error(err);
  process.exit(1);
});
fi.on('line', function(line) {
  console.log(fi.filelineno(), line.toString());
});
fi.on('file', function(file) {
  console.log('----\n--', file + ':');
});
fi.on('end', function() {
  console.log('-- end --');
});
