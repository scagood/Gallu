var GA = require('../');

// Import the dataset
var data = GA.parse('data/data2.txt', '(0|1)(0|1)(0|1)(0|1)(0|1)(0|1) (0|1)', [1, 1, 1, 1, 1, 1, 0]);

// Core GA variables
var inputLength = 6;
var outputLength = 1;
var initaialRules = 10;
var poolSize = 100;
var geneCount = initaialRules * (inputLength + outputLength);

var i = 1;
var carry;

// The fitness function
var fitness = function (rules) {
    return GA.check(data, GA.build(rules.slice(0), inputLength, outputLength));
};

// Setup the GA
var ga = new GA.GA(poolSize, geneCount);

// Change the built in can wildcard function
ga.setCanWildcard(function (geneId) {
    return geneId % (inputLength + outputLength) >= inputLength ? 0 : 1;
});

// Initalise the GA
ga.init();

ga.evaluate(fitness);
carry = ga.getBest();

while (i) {
    ga.evaluate(fitness);

    ga.setWorst(carry);
    carry = ga.getBest();

    console.log(
        i + ' ' +
        ga.getAverageFitness().toFixed(2) + ' ' +
        ga.getAverageLength().toFixed(0) + ' ' +
        carry.fitness + ' ' +
        carry.data.length
    );

    ga.select(2);

    ga.crossover({
        ruleLength: inputLength + outputLength
    });

    ga.mutate(2 / geneCount, '#', 1 / 3, inputLength + outputLength, 5 / poolSize);
    i++;
}
