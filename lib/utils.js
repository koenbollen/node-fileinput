
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
}

function splitLines( buf, callback ) {
  process.nextTick(function() {

    var ix, last = 0;
    var lines = [];
    var remain = null;

    do {
      ix = bufferIndexOf( buf, 0x0a, last );
      if( ix >= 0 ) {
        lines.push(buf.slice(last, ix+1));
        last = ix + 1;
      } else if( last <= buf.length ) {
        remain = buf.slice(last);
      }
    } while(ix != -1);

    callback(lines, remain);

  });
}

exports.bufferIndexOf = bufferIndexOf;
exports.splitLines = splitLines;
