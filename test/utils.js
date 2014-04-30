
var assert = require('assert');
var utils = require('../lib/utils');

describe('bufferIndexOf()', function() {
  beforeEach(function() {
    this.buf = new Buffer( 'Hello, world!!', 'utf8' );
  });
  it('should return -1 when the value is not present', function() {
    assert.equal(-1, utils.bufferIndexOf(this.buf, 0x0a));
    assert.equal(-1, utils.bufferIndexOf(this.buf, 0x00));
  });
  it('should return the first index of a byte when it\'s present', function() {
    assert.equal(0, utils.bufferIndexOf(this.buf, 0x48)); // H
    assert.equal(4, utils.bufferIndexOf(this.buf, 0x6f)); // o
    assert.equal(7, utils.bufferIndexOf(this.buf, 0x77)); // w
  });
  it('should return the next index of a byte when a start index is given', function() {
    assert.equal(4, utils.bufferIndexOf(this.buf, 0x6f, 3)); // o
    assert.equal(4, utils.bufferIndexOf(this.buf, 0x6f, 4)); // o
    assert.equal(8, utils.bufferIndexOf(this.buf, 0x6f, 5)); // o
    assert.equal(8, utils.bufferIndexOf(this.buf, 0x6f, 6)); // o
  });
});

describe('splitLines()', function() {
  it('should result in an empty list and an empty remain value if called on an empty buffer', function(done) {
    var buf = new Buffer(0);
    utils.splitLines(buf, function(lines, remain) {
      assert.equal(0, lines.length);
      assert.equal(0, remain.length);
      done();
    });
  });
  it('should only fill the remain buffer without anyline if called without newline', function(done) {
    var buf = new Buffer('Just a line without newlines.', 'utf8');
    utils.splitLines(buf, function(lines, remain) {
      assert.equal(0, lines.length);
      assert.deepEqual(buf, remain);
      done();
    });
  });
  it('should result in one line when called with at short with a newline', function(done) {
    var buf = new Buffer('Hello newline!\n', 'utf8');
    utils.splitLines(buf, function(lines, remain) {
      assert.equal(1, lines.length);
      assert.deepEqual(buf, lines[0]);
      assert.equal(0, remain.length);
      done();
    });
  });
  it('should result in 2 lines when called with at string with 2 newlines', function(done) {
    var buf = new Buffer('Snow in my shoe\nAbandoned\nSparrow\'s nest', 'utf8');
    utils.splitLines(buf, function(lines, remain) {
      assert.equal(2, lines.length);
      assert.deepEqual(new Buffer('Snow in my shoe\n','utf8'), lines[0]);
      assert.equal(14, remain.length);
      done();
    });
  });
  it('should also work with windows newlines', function(done) {
    var buf = new Buffer('Hello\r\nworld!\r\nBye now.', 'utf8');
    utils.splitLines(buf, function(lines, remain) {
      assert.equal(2, lines.length);
      assert.deepEqual(new Buffer('Hello\r\n','utf8'), lines[0]);
      assert.equal(8, remain.length);
      done();
    });
  });
});
