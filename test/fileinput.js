
var assert = require('assert');
var path = require('path');

var fileinput = require('../lib/fileinput');

describe('FileInput', function() {

  describe('new FileInput()', function() {
    it('should use process.argv when no arguments given', function() {
      var fake = ['node','./script.js', 'a','b','c'];
      process.argv = fake;
      var input = new fileinput.FileInput();
      assert.deepEqual(fake.slice(2), input._files);
    });
    it('should use files in given array', function() {
      var files = ['a', 'b', 'c'];
      var input = new fileinput.FileInput( files );
      assert.deepEqual(files, input._files);
    });
    it('should use one file if given a string', function() {
      var input = new fileinput.FileInput('a');
      assert.equal('a', input._files[0]);
    });
    it('should use args when a commander like object is given', function() {
      var files = ['a', 'b', 'c'];
      var program = { args: files }; // fake commander instance
      var input = new fileinput.FileInput(program);
      assert.deepEqual(files, input._files);
    });
    it('should read from stdin(-) when an empty array is given (or via argv)', function() {
      var input = new fileinput.FileInput([]);
      assert.equal('-', input._files[0]);
      process.argv = ['node', './script.js'];
      input = new fileinput.FileInput();
      assert.equal('-', input._files[0]);
    });
    it('should raise an error when an invalid arguments is given', function() {
      assert.throws(function() {
        new fileinput.FileInput(1);
      });
      assert.throws(function() {
        new fileinput.FileInput(true);
      });
      assert.throws(function() {
        new fileinput.FileInput({});
      });
    });
  });

  describe('#filename()', function() {
    beforeEach(function() {
      this.pkgfile = path.join(__dirname, '../package.json');
      this.input = new fileinput.FileInput([__filename, this.pkgfile]);
    });
    it('should should return undefined at the start', function() {
      assert.equal(undefined, this.input.filename());
    });
    it('should should return the filename after the first read', function() {
      this.input.readline(function(){});
      assert.equal(__filename, this.input.filename());
    });
    it('should return the second filename at the second file event', function(done) {
      var first = true;
      this.input.on('file', function(filename) {
        if(first) {
          first = false;
          return;
        }
        assert.equal(this.pkgfile, this.input.filename());
        done();
      }.bind(this)).on('end', function() {});
    });
    it('should return undefined after the `end\' event', function(done) {
      this.input.on('end', function() {
        assert.equal(undefined, this.input.filename());
        done();
      }.bind(this));
    });
  });

  describe('#[file]lineno()', function() {
    beforeEach(function() {
      this.input = new fileinput.FileInput([__filename, path.join(__dirname, '../package.json')]);
    });
    it('should return 0 when nothing has been read yet', function() {
      assert.equal(0, this.input.filelineno());
      assert.equal(0, this.input.lineno());
    });
    it('should return 1 when a line is been read', function(done) {
      this.input.readline(function() {
        assert.equal(1, this.input.filelineno());
        assert.equal(1, this.input.lineno());
        done();
      }.bind(this));
    });
    it('should differ after a file change', function(done) {
      var firstfile = true;
      this.input.on('file', function(file) {
        if(firstfile) {
          assert.equal(0, this.input.filelineno());
          assert.equal(0, this.input.lineno());
          firstfile = false;
        } else {
          assert.equal(0, this.input.filelineno());
          assert.notEqual(0, this.input.lineno());
        }
      }.bind(this)).on('end', done);
    });
  });

});
