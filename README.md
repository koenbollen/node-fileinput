fileinput
=========

A class and functions to quickly write a loop over standard input or a list of
files. Heavilly inspired by the [fileinput][py-fileinput] module of Python.

[![Build Status](https://travis-ci.org/koenbollen/node-fileinput.svg?branch=master)](https://travis-ci.org/koenbollen/node-fileinput)

Installation
------------

    $ npm install fileinput


Typical Usage
-------------

```js
var fileinput = require('fileinput');

fileinput.input()
  .on('line', function(line) {
  	console.log( fileinput.lineno(), line.toString('utf8') );
  });
```

This will read files specified in `process.argv` and emit each line to the
event _line_. When no filenames are found in argv it will default to reading
from stdin (this can also be achieved by using `-` as a filename).

Files can also be passed to the .input() function directly:

```js
var fileinput = require('fileinput');

var lines = 0;
fileinput.input(['index.js', 'lib/fileinput.js')
  .on('line', function(line) {
    if(line.toString().trim().length > 0) {
      lines += 1;
    }
  })
  .on('end', function() {
    console.log('lines:', lines);
  });
```

Or use it in combination with [commander](https://github.com/tj/commander.js):

```js
var fileinput = require('fileinput');

var program = require('commander');
program.version('1.0.0')
  .usage('[options] file...')
  .option('-v, --verbose', 'output line')
  .parse(process.argv);

fileinput.input(program)
  .on('line', function(line) {
    if(program.verbose) {
      process.stdout.write(line.toString());
    }
  });
```

See `examples/` from more uses.


API documentation
-----------------

Read the examples, tests and source for now, sorry...



Todo
----

 * Support stdin reading for Windows (it now uses /dev/stdin)


[py-fileinput]: https://docs.python.org/3/library/fileinput.html "11.3. fileinput — Iterate over lines from multiple input streams"
