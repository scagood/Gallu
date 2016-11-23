var belt = require('belt.js');

var crossover = function (rabbits, crossover, shuffle) {
    var kits = [];
    var gore = [];
    var a;
    var b;
    var c;
    var d;

    // Check Inputs
    // Check crossover and correct if possible
    crossover = belt.compare.isArray(crossover) ? crossover : (isNaN(crossover) === false) ? [crossover] : null;

    // Check parents are an array
    if (crossover === null || !belt.compare.isArray(rabbits)) {
        return false;
    }

    // If crossover points are not numbers end.
    for (a in crossover) {
        if ({}.hasOwnProperty.call(crossover, a) && isNaN(crossover[a])) {
            return false;
        }
    }

    // If rabbits are not rabbits.
    for (a in rabbits) {
        if ({}.hasOwnProperty.call(rabbits, a) && !belt.compare.isArray(rabbits[a])) {
            return false;
        }
    }

    // Add 0 to crossover points
    if (crossover[0] !== 0) {
        crossover.unshift(0);
    }

    // Initialise the number of parts to cut the rabbits into
    a = crossover.length;
    while (a--) {
        gore.push([]);
    }

    // Determin how shuffle the rabbit parts around
    shuffle = belt.compare.isDefined(shuffle) ? shuffle : belt.shuffle.derange;

    // Cut the rabbits into pieces
    for (a in rabbits) {
        if ({}.hasOwnProperty.call(rabbits, a)) {
            // Cut the rabbits partCount times
            for (b = 0; b < crossover.length; b++) {
                gore[b][a] = rabbits[a].slice(crossover[b], belt.compare.isDefined(crossover[b + 1]) ? crossover[b + 1] : rabbits[a].length);
            }

            // Initialise the kits array
            kits[a] = [];
        }
    }

    // Part to not shuffle
    b = belt.generator.randomInt(gore.length - 1, 0);
    // Array IDs are strings.
    b = b.toString();

    // Shuffle the correct parts
    for (a in gore) {
        if ({}.hasOwnProperty.call(gore, a) && a !== b) {
            // Convert array to shuffle into keys.
            d = true;
            c = Object.keys(gore[a]);

            c = shuffle(c);

            // Convert keys to array
            for (d = 0; d < c.length; d++) {
                c[d] = gore[a][c[d]];
            }

            gore[a] = c;
        }
    }

    // Sow the heads and tails to gether
    for (a in gore) {
        if ({}.hasOwnProperty.call(gore, a)) {
            for (b in gore[a]) {
                if ({}.hasOwnProperty.call(gore[a], b)) {
                    kits[b] = kits[b].concat(gore[a][b]);
                }
            }
        }
    }

    // Clear memory
    gore = [];

    return kits;
};

module.exports = crossover;
