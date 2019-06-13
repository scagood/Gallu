function buildInts(input, inputLength, outputLength) {
    const rules = [];
    const array = input.slice(0);

    while (array.length > 0) {
        const next = array.splice(0, inputLength + outputLength);

        if (next.length !== inputLength + outputLength) {
            const error = new Error('Length be wrong!');

            error.next = next;
            error.inputLength = inputLength;
            error.outputLength = outputLength;

            throw error;
        }

        rules.push({
            input: next.splice(0, inputLength),
            output: next.splice(0, outputLength),
        });
    }

    return rules;
}

function buildFloats(array, inputLength, outputLength) {
    const rules = buildInts(array, 2 * inputLength, outputLength);

    return rules.map(rule => {
        const next = [];

        while (rule.input.length > 0) {
            const input = [
                rule.input.shift(),
                rule.input.shift(),
            ];

            // Force input[0] to be less than input[1]
            if (input[0] > input[1]) {
                input.push(input.shift());
            }

            // Add to new input
            next.push(input);
        }

        // Overwrite old rule input
        rule.input = next;

        return rule;
    });
}

module.exports = buildInts;
module.exports.buildInts = buildInts;
module.exports.buildFloats = buildFloats;
