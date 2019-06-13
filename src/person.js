function Person(
    seed,
    bounds,
    random = Math.random
) {
    let a = 0;

    this.data = [];
    this.fitness = 0;

    // Check to see if this entry is seeded
    if (Array.isArray(seed)) {
        // There is a seed so use it.
        this.data = seed;

        return this;
    }

    if (isNaN(seed) === false) {
        // Go through the gene length
        while (a < seed) {
            /*
             * Generate a random number
             * Round it correctly to precision
             */
            const min = bounds.getMin(a);
            const max = bounds.getMax(a);
            const rand = min + (random() * (max - min));
            const precision = 10 ** bounds.getDP(a);

            this.data[a++] = Math.round(rand * precision) / precision;
        }

        return this;
    }

    throw new Error('Unknown Input');
}

module.exports = Person;
