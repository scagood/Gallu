var comp = require('./compare');

var isDef = comp.isDef;
var random = function (min, max) {
    min = isDef(max) ? min : 0;
    max = isDef(max) ? max : isDef(min) ? min : 1;
    return (Math.random() * (max - min)) + min;
};
var randomInt = function (max, min) {
    max = isDef(max) ? Math.round(max) : 1;
    min = isDef(min) ? Math.round(min) : 0;

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var randomArray = function (size, depth, min, max) {
    var out = [];
    var arr;
    var a;
    while (size--) {
        arr = [];
        a = depth;
        while (a--) {
            arr.push(randomInt(max, min));
        }
        out.push(arr);
    }

    return out;
};

module.exports = {
    rand: random,
    randArray: randomArray,
    randInt: randomInt,
    random: random,
    randomArray: randomArray,
    randomInt: randomInt
};
