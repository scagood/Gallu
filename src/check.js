function inputMatchInt(data, rule, wildcard) {
    var matching = true;
    var a;

    wildcard = typeof wildcard === 'undefined' ? '#' : wildcard;

    for (a = 0; a < data.length; a++) {
        if (rule[a] !== wildcard && data[a] !== rule[a]) {
            matching = false;
            break;
        }
    }

    return matching;
}
function inputMatchFloat(data, rule, wildcard) {
    var matching = true;
    var a;

    wildcard = typeof wildcard === 'undefined' ? '#' : wildcard;

    for (a = 0; a < data.length; a++) {
        if (
            !(rule[a][0] < data[a] && data[a] < rule[a][1]) &&
            !(rule[a][0] === wildcard || rule[a][1] === wildcard)
        ) {
            matching = false;
            break;
        }
    }

    return matching;
}
function outputMatch(data, rule) {
    var matching = 1;
    var a;

    for (a = 0; a < data.length; a++) {
        if (data[a] !== rule[a]) {
            matching = 0;
            break;
        }
    }

    return matching;
}
function checkDataPoint(data, rules, wildcard, isFloat) {
    var a;
    isFloat = typeof isFloat === 'undefined' ? false : isFloat;

    // Check current against rules
    for (a = 0; a < rules.length; a++) {
        if (
            (isFloat === false && inputMatchInt(data.input, rules[a].input, wildcard)) ||
            (isFloat === true && inputMatchFloat(data.input, rules[a].input, wildcard))
        ) {
            return outputMatch(data.output, rules[a].output);
        }
    }
    return 0;
}
var checkDataSet = function (data, rules, wildcard, isFloat) {
    var a;
    var fitness = 0;

    // For every data point
    for (a = 0; a < data.length; a++) {
        fitness += checkDataPoint(data[a], rules, wildcard, isFloat);
    }

    return fitness;
};

module.exports = checkDataSet;
