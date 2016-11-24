var comp = require('./compare');

// Extracting bits from a byte
var bitExtraction = function (input, offset, length, intLen) {
    var comp = 0;
    var a;
    if (typeof intLen === 'undefined') {
        intLen = (Math.ceil(input.toString(2).length / 8) * 8);
    }

    length = (typeof length === 'undefined') ? 1 : length;
    offset = (typeof offset === 'undefined') ? 0 : offset;

    for (a = 0; a < length; a++) {
        comp = (comp << 1) | 1;
    }

    offset = intLen - offset - comp.toString(2).length;

    return (input & (comp << offset)) >> offset;
};

var indexOf = function (array, find) {
    var i;
    // Confirm that the array exists and it is an array
    if (array === 'undefined' || !comp.isArr(array)) {
        return false;
    }
    // Search the array
    for (i = 0; i < array.length; i++) {
        // If it is what you are looking for return the position
        if (array[i] === find) {
            return i;
        }
    }
    // If it is not found return -1
    return -1;
};

module.exports = {
    bitExtraction: bitExtraction,
    indexOf: indexOf
};
