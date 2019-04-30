const crossover = require('./crossover');
const derange = require('./derange');
const Person = require('./person');

function map(old, fMin, fMax, tMin, tMax) {
    // Catch divied by zero
    if (fMax - fMin === 0) {
        // If the range is 0 to 0 the the answer is always 0
        return 0;
    }

    return ((old - fMin) * (tMax - tMin) / (fMax - fMin)) + tMin;
}

function probMap(old, low = 0, high = 1, prob = 1) {
    let res;
    if (old >= 0 && old <= (0.5 - (prob / 2))) {
        res = map(old, 0, (0.5 - (prob / 2)), 0, low);
    } else if (old >= (0.5 - (prob / 2)) && old <= (0.5 + (prob / 2))) {
        res = map(old, (0.5 - (prob / 2)), (0.5 + (prob / 2)), low, high);
    } else if (old >= (0.5 + (prob / 2)) && old <= 1) {
        res = map(old, (0.5 + (prob / 2)), 1, high, 1);
    } else {
        res = false;
    }

    return res;
}

// The GA 'class'
const GA = function (poolSize, geneLength, seeds = []) {
    let population = [];
    let k = 0;

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
        let a = 0;
        let b;
        let current;
        const oldPopulation = population.slice(0);
        const newPopulation = [];
        let newRule = [];

        lenOfLenMutate = Math.abs(lenOfLenMutate);

        // For every person
        while (a < population.length) {
            // Remove a person from the old population
            current = oldPopulation.pop();
            // Extract the data from them.
            current = current.data;

            // Mutate Length
            if (probOfLenMutate > Math.random()) {
                b = 0;
                if (Math.random() < lenMutateWeight) {
                    // Additive
                    newRule = [];
                    // Generate the new rule.
                    while (b < lenOfLenMutate) {
                        // Generate a random number (between the given bounds) and round it correctly to precision
                        const min = bounds.getMin(b + current.length);
                        const max = bounds.getMax(b + current.length);
                        const rand = min + (Math.random() * (max - min));
                        const precision = 10 ** bounds.getDP(b + current.length);

                        newRule[b++] = Math.round(rand * precision) / precision;
                    }

                    // Add the rule into the current person, ensuring the data structure isn't broken
                    current.splice(
                        Math.floor(Math.random() * current.length / lenOfLenMutate) * lenOfLenMutate,
                        0,
                        ...newRule
                    );
                } else if (lenOfLenMutate !== 0) {
                    // Subtractive
                    // Remove a rule from the current person, ensuring the data structure isn't broken
                    const random = Math.floor(Math.random() * ((current.length / lenOfLenMutate) + 1));
                    current.splice(random * lenOfLenMutate, lenOfLenMutate);
                }
            }

            b = 0;
            // For each gene
            while (b < current.length) {
                // If this should be mutated
                if (prob > Math.random()) {
                    // If mutate to wildcard
                    if (current[b] !== wildcard && wildprob > Math.random() && bounds.getCanWildcard(b) === 1) {
                        // Go to wildcard
                        current[b] = wildcard;
                    } else {
                        const min = bounds.getMin(b);
                        const max = bounds.getMax(b);
                        const rand = min + (Math.random() * (max - min));
                        const precision = 10 ** bounds.getDP(b);

                        current[b] = Math.round(rand * precision) / precision;
                    }
                }

                b++;
            }

            // Add the mutated person to the new population
            newPopulation.push(new Person(current));
            a++;
        }

        // Overwrite the old population with the new population
        population = newPopulation;
    };

    // Selection
    this.select = function (size = 2) {
        const newPopulation = [];
        let people;
        let current;
        let best;
        let a;
        let b = population.length;

        // For every gene
        while (b--) {
            a = size;
            people = [];
            while (a--) {
                // Select 'size' random people from the population
                people.push(population[Math.floor(Math.random() * population.length)]);
            }

            // Find the 'fitest' aka best person(s)
            best = people[0];
            for (a = 0; a < people.length; a++) {
                current = people[a];
                if (current.fitness > best.fitness) {
                    best = current;
                }
            }

            // Find all the 'fitest' people and select them
            for (a = 0; a < people.length; a++) {
                if (best.fitness !== people[a].fitness) {
                    people.splice(a, 1);
                }
            }

            best = people[0];
            // Find the smallest and 'fitest' person and select them
            for (a = 0; a < people.length; a++) {
                current = people[a];
                if (current.data.length < best.data.length) {
                    best = current;
                }
            }

            // Add the best person to the new population
            newPopulation.push(best);
        }

        // Overwrite the old population with the new one.
        population = newPopulation;
    };

    this.getBest = function () {
        let s = population[0];
        let a;

        // Find all the 'fitest' people and select them
        for (a = 0; a < population.length; a++) {
            if (s.fitness < population[a].fitness) {
                s = population[a];
            }
        }

        // Find the smallest and 'fitest' person and select them
        for (a = 0; a < population.length; a++) {
            if (s.data.length > population[a].data.length && s.fitness === population[a].fitness) {
                s = population[a];
            }
        }

        // Return the best person.
        return s;
    };

    this.getWorst = function (c) {
        let s = population[0];
        let t = 0;
        let a = 0;

        // Find the least 'fit' person
        while (a < population.length) {
            if (population[a].fitness < s.fitness) {
                s = population[a];
                t = a;
            }

            a++;
        }

        return c ? t : s;
    };

    this.setWorst = function (person) {
        // Overwrite the lest 'fit' person with the previous 'fitest'
        population[this.getWorst(true)] = person;
    };

    this.getTotalFitness = function () {
        let s = 0;
        let a = 0;
        // Add all the fitnesses together.
        while (a < population.length) {
            s += population[a].fitness;
            a++;
        }

        return s;
    };

    this.getAverageFitness = function () {
        // Divide the total fitness by the number of people.
        return this.getTotalFitness() / poolSize;
    };

    this.getAverageLength = function () {
        let s = 0;
        let a = 0;
        // Add all the lengths together
        while (a < population.length) {
            s += population[a].data.length;
            a++;
        }

        // Divide by the number of people.
        return s / population.length;
    };

    this.getPopulation = function () {
        // Return an unassociated population
        return population.slice(0);
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
        if (poolSize >= seeds.length) {
            // For every seed
            while (k < seeds.length) {
                // Create a seeded person
                population[k] = new Person(seeds[k], bounds);
                k++;
            }

            // For the unseeded population
            while (k < poolSize) {
                // Create the rest of the unseeded people
                population[k] = new Person(geneLength, bounds);
                k++;
            }
        } else {
            throw new Error('Too many seeds for the pool size.');
        }
    };
};

module.exports = GA;
