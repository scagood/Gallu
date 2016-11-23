var GA = require('../');

// Import the training dataset
var data = GA.parse('data/data3-train.txt', '([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) (0|1)', [1, 1, 1, 1, 1, 1, 0]);

// Import the full dataset
var dataFull = GA.parse('data/data3.txt', '([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) (0|1)', [1, 1, 1, 1, 1, 1, 0]);

// GA's core variables
var inputLength = 6;
var outputLength = 1;
var initaialRules = 10;
var poolSize = 100;
var geneCount = initaialRules * ((2 * inputLength) + outputLength);

var i = 1;
var carry;
var temp;

// The fitness function
var fitness = function (rules) {
    return GA.check(data, GA.build(rules.slice(0), inputLength, outputLength, true), '#', true);
};

// Setup the GA
var ga = new GA.GA(poolSize, geneCount);

// The precision function
ga.setDP(function (geneId) {
    return geneId % ((2 * inputLength) + outputLength) >= (2 * inputLength) ? 0 : 6;
});

// Initalise the GA
ga.init();

ga.evaluate(fitness);
carry = ga.getBest();

while (i) {
    ga.evaluate(fitness);

    ga.setWorst(carry);
    carry = ga.getBest();

    temp = carry.data.slice(0);
    temp = GA.build(temp, inputLength, outputLength, true);

    console.log(
        i + ' ' +
        ga.getAverageFitness().toFixed(2) + ' ' +
        ga.getAverageLength().toFixed(0) + ' ' +
        carry.fitness + ' ' +
        carry.data.length + ' ' +
        GA.check(dataFull, temp, '#', true)
    );

    ga.select(2);

    ga.crossover({
        ruleLength: (2 * inputLength) + outputLength
    });

    ga.mutate(2 / geneCount, '#', 1 / 3, (2 * inputLength) + outputLength, 1 / (poolSize * 10), 1 / 3);
    i++;
}
