const crossover = require('./crossover');
const derange = require('./derange');
const Person = require('./person');
const {
    findDeep,
    smallestBestReduce,
    largestWorstReduce
} = require('./reducers');

function map(old, fMin, fMax, tMin, tMax) {
    // Catch divied by zero
    if (fMax - fMin === 0) {
        return 0;
    }

    return tMin + (
        (old - fMin) *
        (tMax - tMin) /
        (fMax - fMin)
    );
}

function probMap(old, low = 0, high = 1, prob = 1) {
    const pos = 0.5 + (prob / 2);
    const neg = 0.5 - (prob / 2);

    if (old >= neg && old <= pos) {
        return map(old, neg, pos, low, high);
    }

    if (old >= 0 && old <= neg) {
        return map(old, 0, neg, 0, low);
    }

    if (old >= pos && old <= 1) {
        return map(old, pos, 1, high, 1);
    }

    return false;
}

// The GA 'class'
const GA = function (poolSize, geneLength, seeds = []) {
    let population;

    // The default 'bounds' functions
    const bounds = {
        getMin() {
            return 0;
        },
        getMax() {
            return 1;
        },
        getDP() {
            return 0;
        },
        getCanWildcard() {
            return 0;
        }
    };

    // Evaluate
    this.evaluate = function (callback) {
        let a = 0;
        let total = 0;
        // For every person
        while (a < population.length) {
            // Test their fitness (callback is the test function)
            population[a].fitness = callback(population[a].data);
            total += population[a].fitness;
            a++;
        }

        // Return the average fitness
        return total / population.length;
    };

    // Crossover
    this.crossover = function (
        {
            prob = 0.8,
            low = 0.6,
            high = 0.9,
            count = 1,
            ruleLength = 1
        } = {},
        maxNum = 2,
        minNum = 2,
        shuffle = derange,
    ) {
        // Preserve the old population till overwrite
        const oldPopulation = population.slice(0);
        let newPopulation = [];
        let crossoverPoint;

        let geneCount = oldPopulation.length;
        let a;
        let numberToCrossover;
        let genes = [];

        // For all the population
        while (geneCount > 0) {
            // How many should be crossed over
            numberToCrossover = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

            // Clear previous crossover pool
            genes = [];

            // Prevent a single thing being not crossed over
            if (geneCount - numberToCrossover < minNum && geneCount - numberToCrossover > 0) {
                numberToCrossover += geneCount - numberToCrossover;
            }

            for (a = 0; a < numberToCrossover; a++) {
                // Remove a gene from the old population and add it to the crossover pool
                crossoverPoint = oldPopulation.splice(
                    Math.floor(Math.random() * oldPopulation.length),
                    1
                )[0];
                genes.push(crossoverPoint.data);
                geneCount--;
            }

            crossoverPoint = [];
            // Generate the crossover points
            for (a = 0; a < count; a++) {
                crossoverPoint[a] = Math.random();
                crossoverPoint[a] = probMap(crossoverPoint[a], low, high, prob);
                crossoverPoint[a] *= Math.max(...genes) / ruleLength;
                crossoverPoint[a] = Math.round(crossoverPoint[a]);
                crossoverPoint[a] *= ruleLength;
            }

            // Do the crossover
            genes = crossover(genes, crossoverPoint, shuffle);

            // Add the crossed over people to the new population
            newPopulation = newPopulation.concat(genes);
        }

        // Make the crossed over children into people.
        for (a = 0; a < newPopulation.length; a++) {
            newPopulation[a] = new Person(newPopulation[a]);
        }

        // Overwrite the old population.
        population = newPopulation;
    };

    // Mutation
    this.mutate = function (
        prob = 1 / geneLength,
        wildcard = '#',
        wildprob = 0,
        lenOfLenMutate = 0,
        probOfLenMutate = 1 / geneLength,
        lenMutateWeight = 0.5
    ) {
        const oldPopulation = population.slice(0);
        const newPopulation = [];

        lenOfLenMutate = Math.abs(lenOfLenMutate);

        // For every person
        while (oldPopulation.length) {
            // Remove a person from the old population
            let {data} = oldPopulation.pop();

            // Mutate Length
            if (probOfLenMutate > Math.random()) {
                if (Math.random() < lenMutateWeight) {
                    // Additive
                    const newRule = [];
                    // Generate the new rule.
                    let b = 0;
                    while (b < lenOfLenMutate) {
                        // Generate a random number (between the given bounds) and round it correctly to precision
                        const min = bounds.getMin(b + data.length);
                        const max = bounds.getMax(b + data.length);
                        const rand = min + (Math.random() * (max - min));
                        const precision = 10 ** bounds.getDP(b + data.length);

                        newRule[b++] = Math.round(rand * precision) / precision;
                    }

                    // Add the rule into the current person, ensuring the data structure isn't broken
                    const index = Math.floor(Math.random() * data.length / lenOfLenMutate) * lenOfLenMutate;
                    data.splice(index, 0, ...newRule);
                } else if (lenOfLenMutate !== 0) {
                    // Subtractive
                    // Remove a rule from the current person, ensuring the data structure isn't broken
                    const random = Math.floor(Math.random() * ((data.length / lenOfLenMutate) + 1));
                    data.splice(random * lenOfLenMutate, lenOfLenMutate);
                }
            }

            // For each gene
            data = data.map((gene, id) => {
                // If this should be mutated
                if (prob > Math.random()) {
                    // If mutate to wildcard
                    if (
                        gene !== wildcard &&
                        wildprob > Math.random() &&
                        bounds.getCanWildcard(id) === 1
                    ) {
                        // Go to wildcard
                        return wildcard;
                    }

                    const min = bounds.getMin(id);
                    const max = bounds.getMax(id);
                    const rand = min + (Math.random() * (max - min));
                    const precision = 10 ** bounds.getDP(id);

                    return Math.round(rand * precision) / precision;
                }

                return gene;
            });

            // Add the mutated person to the new population
            newPopulation.push(new Person(data));
        }

        // Overwrite the old population with the new population
        population = newPopulation;
    };

    // Selection
    this.select = function (size = 2) {
        population = population.map(() => {
            const people = [];
            let a = size;
            while (a--) {
                // Select 'size' random people from the population
                const index = Math.floor(Math.random() * population.length);
                people.push(population[index]);
            }

            // Find the 'fitest' aka best person(s)
            return people.reduce(smallestBestReduce);
        });
    };

    this.getBest = function () {
        return population.reduce(smallestBestReduce);
    };

    this.getWorst = function () {
        return population.reduce(largestWorstReduce);
    };

    this.setWorst = function (person) {
        const index = population.findIndex(
            findDeep(this.getWorst())
        );
        population[index] = person;
    };

    this.getTotalFitness = function () {
        return population.reduce(
            (carry, {fitness}) => carry + fitness,
            0
        );
    };

    this.getAverageFitness = function () {
        return this.getTotalFitness() / population.length;
    };

    this.getTotalLength = function () {
        return population.reduce(
            (carry, {data: {length}}) => carry + length,
            0
        );
    };

    this.getAverageLength = function () {
        return this.getTotalLength() / population.length;
    };

    this.getPopulation = function () {
        // Return an unassociated population
        return population;
    };

    // Default set bound functions
    this.setMin = function (min) {
        if (typeof min === 'number') {
            bounds.getMin = () => min;
            return this;
        }

        if (typeof min === 'function') {
            bounds.getMin = min;
            return this;
        }

        bounds.getMin = () => 0;
        return this;
    };

    this.setMax = function (max) {
        if (typeof max === 'number') {
            bounds.getMax = () => max;
            return this;
        }

        if (typeof max === 'function') {
            bounds.getMax = max;
            return this;
        }

        bounds.getMax = () => 0;
        return this;
    };

    this.setDP = function (precision) {
        if (typeof precision === 'number') {
            bounds.getDP = () => precision;
            return this;
        }

        if (typeof precision === 'function') {
            bounds.getDP = precision;
            return this;
        }

        bounds.getDP = () => 0;
        return this;
    };

    this.setCanWildcard = function (canWildcard) {
        if (typeof canWildcard === 'number') {
            bounds.getCanWildcard = () => canWildcard;
            return this;
        }

        if (typeof canWildcard === 'function') {
            bounds.getCanWildcard = canWildcard;
            return this;
        }

        bounds.getCanWildcard = () => 0;
        return this;
    };

    this.init = function () {
        // Set seeds to empty if non are given
        if (poolSize < seeds.length) {
            throw new Error('Too many seeds for the pool size.');
        }

        let k = 0;
        population = [];

        // For every seed
        while (k < seeds.length) {
            // Create a seeded person
            population[k++] = new Person(seeds[k], bounds);
        }

        // For the unseeded population
        while (k < poolSize) {
            // Create the rest of the unseeded people
            population[k++] = new Person(geneLength, bounds);
        }
    };
};

module.exports = GA;
