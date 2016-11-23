var GA = require('./ga');
var parse = require('./parse');
var check = require('./check');

var arrayToRule = function (array, inputLength, outputLength, isFloat) {
    var a;
    var b;
    var temp;
    var rules = [];

    inputLength *= (isFloat ? 2 : 1);

    while (array.length > 0) {
        temp = array.splice(0, inputLength + outputLength);

        if (temp.length !== inputLength + outputLength) {
            console.log(temp, inputLength, outputLength);
            throw new Error('Length be wrong!');
        }
        rules.push({
            input: temp.splice(0, inputLength),
            output: temp.splice(0, outputLength)
        });
    }

    if (isFloat === true) {
        for (a = 0; a < rules.length; a++) {
            temp = [];
            while (rules[a].input.length > 0) {
                b = [
                    rules[a].input.shift(),
                    rules[a].input.shift()
                ];

                // Force b[0] to be less tham b[1]
                if (b[0] > b[1]) {
                    b.push(b.shift());
                }

                // Add to new input
                temp.push(b);
            }
            // Overwrite old rule input
            rules[a].input = temp;
        }
    }

    return rules;
};

module.exports = {
    GA: GA,
    parse: parse,
    build: arrayToRule,
    check: check

};
