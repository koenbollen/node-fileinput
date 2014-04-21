fileinput
=========

A class and functions to quickly write a loop over standard input or a list of 
files. Heavilly inspired by the fileinput module of Python.


Installation
------------

    $ npm install fileinput


Typical Usage
-------------

    var fileinput = require('fileinput');

    fileinput.input()
      .on('line', function(line) {
      	console.log( fileinput.lineno(), line.toString('utf8') );
      });

This will read files specified in `process.argv` and emit each line to the 
event _line_. When no filenames are found in argv it will default to reading
from stdin (this can also be achieved using '-').

Files can also be passed to the .input() function directly:

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

See `examples/` from more uses.


API documentation
-----------------

read the sourc for now...



Todo
----

 * Test node version and add this to the package.json
 * Support stdin reading for Windows (it now uses /dev/stdin)
