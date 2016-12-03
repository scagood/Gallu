var fs = require('fs');
var GA = require('../');

// Import the dataset
var data = fs.readFileSync('data/data1.txt').toString();
data = GA.parse(data, '(0|1)(0|1)(0|1)(0|1)(0|1) (0|1)', ['In-Int', 'In-Int', 'In-Int', 'In-Int', 'In-Int', 'Out-Int']);

// Core GA variables
var inputLength = 5;
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

    if (i % 100 === 0) {
        console.log(JSON.stringify(carry));
    }

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

    ga.mutate(1 / geneCount, '#', 1 / 3);
    i++;
}
