const derange = require('./derange');

function carve(rabbits, crossover) {
    // Initialise the arrays for the parts of the cut rabbits to go into
    const gore = new Array(crossover.length).fill([]);

    rabbits.forEach(rabbit => {
        // Cut the rabbits partCount times
        for (let count = 0; count < crossover.length; count++) {
            let end = crossover[count + 1];

            if (end === undefined) {
                end = rabbit.length;
            }

            gore[count].push(
                rabbit.slice(crossover[count], end)
            );
        }
    });

    return gore;
}

function arrange(gores, ignore, shuffle) {
    return gores.map((gore, index) => {
        if (index === ignore) {
            return gore;
        }

        let keys = Object.keys(gore);
        keys = shuffle(keys);

        return keys.map(index => gore[index]);
    });
}

function stitch(gores) {
    return gores.map(gore => {
        const kit = [];
        gore.forEach(bits => kit.push(...bits));
        return kit;
    });
}

function crossover(
    rabbits,
    crossover,
    shuffle = derange,
    random = Math.random
) {
    // If rabbits are not rabbits.
    if (!Array.isArray(rabbits) || rabbits.every(Array.isArray)) {
        const error = new Error('Invalid rabbits');
        error.crossover = crossover;

        throw error;
    }

    // If crossover points are not numbers end.
    if (!Array.isArray(crossover) || crossover.every(input => typeof input === 'number')) {
        const error = new Error('Invalid crossover');
        error.crossover = crossover;

        throw error;
    }

    // Add 0 to crossover points
    if (crossover[0] !== 0) {
        crossover.unshift(0);
    }

    // Cut the rabbits into pieces
    const gore = carve(rabbits, crossover);

    // Re-arrange the bits
    const bits = arrange(
        gore,
        // Part to not shuffle
        Math.floor(random() * gore.length),
        shuffle
    );

    // Sow the heads and tails to gether
    const kits = stitch(bits);

    return kits;
}

module.exports = crossover;

module.exports.carve = carve;
module.exports.arrange = arrange;
module.exports.stitch = stitch;
