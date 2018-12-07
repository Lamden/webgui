function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function hex2buf(hexString) {
    var bytes = new Uint8Array(Math.ceil(hexString.length / 2));
    for (var i = 0; i < bytes.length; i++) bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
    return bytes;
}

function str2buf(string) {
    var buf = new Buffer.from(string);
    return new Uint8Array(buf);
}

function concatUint8Arrays(array1, array2) {
    arr = new Uint8Array(array1.length + array2.length);
    arr.set(array1);
    arr.set(array2, array1.length);
    return arr;
}

module.exports.buf2hex = buf2hex;
module.exports.hex2buf = hex2buf;
module.exports.str2buf = str2buf;
module.exports.concatUint8Arrays = concatUint8Arrays;
