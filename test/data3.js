const {promises: fs} = require('fs');
const GA = require('..');

const In = {
    type: 'float',
    group: 'input',
};
const Out = {
    type: 'int',
    group: 'output',
};

(async function () {
    // Import the dataset
    let dataFull = await fs.readFile('data/data3.txt');
    dataFull = dataFull.toString();
    dataFull = GA.parse(dataFull, '([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) (0|1)', [
        In, In, In, In, In, In, Out,
    ]);

    // Import the full dataset
    const data = dataFull.slice(0, 1000);

    // GA's core variables
    const inputLength = 6;
    const outputLength = 1;
    const initaialRules = 6;
    const poolSize = 100;
    const geneCount = initaialRules * ((2 * inputLength) + outputLength);

    let i = 1;
    let carry;
    let temporary;

    // The fitness function
    function fitness(rules) {
        return GA.check(data, GA.build(
            rules.slice(0),
            inputLength,
            outputLength,
            true
        ), '#', true);
    };

    // Setup the GA
    const ga = new GA.GA(poolSize, geneCount);

    // The precision function
    ga.setDP(geneId => (
        geneId % ((2 * inputLength) + outputLength) >= (2 * inputLength)
            ? 0 : 6
    ));

    // Initalise the GA
    ga.init();

    ga.evaluate(fitness);
    carry = ga.getBest();

    while (i) {
        ga.evaluate(fitness);

        ga.setWorst(carry);
        carry = ga.getBest();

        temporary = carry.data.slice(0);
        temporary = GA.build(temporary, inputLength, outputLength, true);

        if (i % 100 === 0) {
            console.log(JSON.stringify(carry));
        }

        console.log([
            i,
            ga.getAverageFitness().toFixed(2),
            ga.getAverageLength().toFixed(0),
            carry.fitness,
            carry.data.length,
            GA.check(dataFull, temporary, '#', true),
        ]);

        ga.select(2);

        ga.crossover({ruleLength: (2 * inputLength) + outputLength});

        ga.mutate(2 / geneCount, '#', 1 / 3, (2 * inputLength) + outputLength, 1 / (poolSize * 10), 1 / 3);
        i++;
    }
})();
