
var assert = require('assert');
var fs = require('fs');
var path = require('path');

var fileinput = require('../lib/fileinput');

describe('\'Common Usage\'', function() {
  it('should read all lines from threelines.txt', function(done) {
    var pathname = path.join(__dirname, 'fixtures/threelines.txt');

    // Read lines manual for comparison:
    var lines = fs.readFileSync(pathname).toString().split('\n');

    // use fileinput:
    var input = new fileinput.FileInput( pathname );
    var count = 0;
    input.on('line', function(line) {
      assert.equal(lines[input.filelineno()-1], line.toString().trim());
      count += 1;
    });
    input.on('end', function() {
      assert.equal(4, count); // has an empty newline.
      done();
    });
  });
  it('should count 1000 lines in 1000lines.txt', function(done) {
    var input = new fileinput.FileInput(path.join(__dirname, 'fixtures/1000lines.txt'));
    var count = 0;
    var last = '';
    input.on('line', function(line) {
      count += 1;
      last = line;
    });
    input.on('end', function() {
      assert.equal(1000, count); // no empty newline
      assert.equal('Koen', last.toString());
      done();
    });
  });
  it('should handle lines longer then bufsize', function(done) {
    var lengths = [1094, 1096, 1095, 1095, 0];
    var counts = [42, 1337, 314, 168];
    var linecount = 0;
    var fileinput = require('../');
    fileinput.input(path.join(__dirname, 'fixtures/longlines.txt'), 256) // lines are >1000, bufsize is 256
      .on('line', function(line) {
        linecount += 1;
        assert.equal(lengths[fileinput.lineno()-1], line.length);
        if(line.length>0) {
          var json = JSON.parse(line.toString());
          assert.equal(counts[fileinput.lineno()-1], json.count);
        }
      })
      .on('end', function() {
        assert.equal(5, linecount);
        done();
      });
  });
  it('should handle utf8 correctly', function(done) {
    var input = new fileinput.FileInput(path.join(__dirname, 'fixtures/UTF-8-demo.txt'));
    var linecount = 0;
    input.on('line', function(line) {
        linecount += 1;
        switch(linecount) {
          case 16:
            assert(line.toString('utf8').indexOf('∮')>=0);
            break;
          case 51:
            assert(line.toString('utf8').indexOf('€')>=0);
            break;
          case 201:
            assert(line.toString('utf8').indexOf('コンニチハ')>=0);
            break;
        }
    });
    input.on('end', function() {
      assert.equal(213, linecount);
      done();
    });
  });
});