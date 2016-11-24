// Random Range Derangements are disscussed here
// http://epubs.siam.org/doi/pdf/10.1137/1.9781611972986.7

// Derange implimentation by Paul Draper
// http://stackoverflow.com/users/1212596/paul-draper
var derangePD = function (array) {
    function derangementNumber(n) {
        if (n === 0) {
            return 1;
        }
        var factorial = 1;
        while (n) {
            factorial *= n--;
        }
        return Math.floor(factorial / Math.E);
    }
    array = array.slice();
    var mark = array.map(function () {
        return false;
    });
    for (var i = array.length - 1, u = array.length - 1; u > 0; i--) {
        if (!mark[i]) {
            var unmarked = mark.map(function (_, i) {
                return i;
            }).filter(function (j) {
                return !mark[j] && j < i;
            });
            var j = unmarked[Math.floor(Math.random() * unmarked.length)];

            var tmp = array[j];
            array[j] = array[i];
            array[i] = tmp;

            // this introduces the unbiased random characteristic
            if (Math.random() < u * derangementNumber(u - 1) / derangementNumber(u + 1)) {
                mark[j] = true;
                u--;
            }
            u--;
        }
    }
    return array;
};

// Derange implimentation by RobG
// http://stackoverflow.com/users/257182/robg
var derangeRG = function (arr) {
    // Make a copy of arr
    var c = arr.slice();

    // If arr.length is < 2, return copy
    if (c.length < 2) {
        return c;
    }

    var result = [];
    var idx;
    var i;
    var iLen;

    // Keep track of whether last member has been moved
    var lastMoved = false;

    // Randomly remove a member of c, with conditions...
    for (i = 0, iLen = c.length - 1; i < iLen; i++) {
        // If get down to final two and last hasn't been moved,
        // swap last two and append to result
        if (c.length === 2 && !lastMoved) {
            result = result.concat(c.reverse().splice(0, 2));
            break;
        }

        // Otherwise, select a remaining member of c
        do {
            idx = Math.random() * c.length | 0;

        // But make sure it's not going back in the same place
        } while (arr.indexOf(c[idx]) === result.length);

        // Add member to result
        result.push(c.splice(idx, 1)[0]);

        // Remember if last was just moved
        lastMoved = lastMoved || idx === c.length;
    }

    // Add the last member, saves a do..while iteration about half the time
    if (c.length === 0) {
        result.push(c[0]);
    }
    return result;
};

// The following shuffle functions are from Mkie Bostock
// https://bost.ocks.org/mike/shuffle/
var decreasingDeck = function (array) {
    array = array.slice();

    var copy = [];
    var n = array.length;
    var i;

    // While there remain elements to shuffle…
    while (n) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * n--);
        // And move it to the new array.
        copy.push(array.splice(i, 1)[0]);
    }

    return copy;
};

var randomElement = function (array) {
    array = array.slice();

    var copy = [];
    var n = array.length;
    var i;

    // While there remain elements to shuffle…
    while (n) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * array.length);

        // If not already shuffled, move it to the new array.
        if (i in array) {
            copy.push(array[i]);
            delete array[i];
            n--;
        }
    }

    return copy;
};

var knuth = function (array) {
    array = array.slice();

    var m = array.length;
    var t;
    var i;

    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
};

module.exports = {
    decreasingDeck: decreasingDeck,
    derange: derangePD,
    derangePD: derangePD,
    derangeRG: derangeRG,
    fisherYates: knuth,
    knuth: knuth,
    randomElement: randomElement
};
