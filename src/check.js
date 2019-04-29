function outputMatch(data, rule) {
    for (let a = 0; a < data.length; a++) {
        if (data[a] !== rule[a]) {
            return 0;
        }
    }

    return 1;
}

const defaultCard = '#';

function inputMatchInt(data, rule, wildcard = defaultCard) {
    for (let a = 0; a < data.length; a++) {
        if (rule[a] !== wildcard && data[a] !== rule[a]) {
            return false;
        }
    }

    return true;
}
function checkIntPoint(data, rules, wildcard = defaultCard) {
    // Check current against rules
    for (let a = 0; a < rules.length; a++) {
        if (inputMatchInt(data.input, rules[a].input, wildcard)) {
            return outputMatch(data.output, rules[a].output);
        }
    }

    return 0;
}
function checkIntSet(data, rules, wildcard = defaultCard) {
    let fitness = 0;

    // For every data point
    for (let a = 0; a < data.length; a++) {
        fitness += checkIntPoint(data[a], rules, wildcard);
    }

    return fitness;
}

function inputMatchFloat(data, rule, wildcard = defaultCard) {
    for (let a = 0; a < data.length; a++) {
        if (
            !(rule[a][0] < data[a] && data[a] < rule[a][1]) &&
            !(rule[a][0] === wildcard || rule[a][1] === wildcard)
        ) {
            return false;
        }
    }

    return true;
}
function checkFloatPoint(data, rules, wildcard = defaultCard) {
    // Check current against rules
    for (let a = 0; a < rules.length; a++) {
        if (inputMatchFloat(data.input, rules[a].input, wildcard)) {
            return outputMatch(data.output, rules[a].output);
        }
    }

    return 0;
}
function checkFloatSet(data, rules, wildcard = defaultCard) {
    let fitness = 0;

    // For every data point
    for (let a = 0; a < data.length; a++) {
        fitness += checkFloatPoint(data[a], rules, wildcard);
    }

    return fitness;
}

module.exports = {
    outputMatch,
    inputMatchInt,
    checkIntPoint,
    checkIntSet,
    inputMatchFloat,
    checkFloatPoint,
    checkFloatSet
};
