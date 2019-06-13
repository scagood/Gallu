function outputMatch(data, rule) {
    return Number(data.every(
        (point, index) => point === rule[index]
    ));
}

const defaultCard = '#';

function inputMatchInt(data, rule, wildcard = defaultCard) {
    return data.every(
        (point, index) => (
            rule[index] === wildcard ||
            point === rule[index]
        )
    );
}

function checkIntPoint(data, rules, wildcard = defaultCard) {
    // Check current against rules
    for (const element of rules) {
        if (inputMatchInt(data.input, element.input, wildcard)) {
            return outputMatch(data.output, element.output);
        }
    }

    return 0;
}

function checkIntSet(data, rules, wildcard = defaultCard) {
    return data.reduce(
        (element, carry) => carry + checkIntPoint(element, rules, wildcard), 0
    );
}

function inputMatchFloat(data, rule, wildcard = defaultCard) {
    for (const [a, element] of data.entries()) {
        if (
            !(rule[a][0] < element && element < rule[a][1]) &&
            !(rule[a][0] === wildcard || rule[a][1] === wildcard)
        ) {
            return false;
        }
    }

    return true;
}

function checkFloatPoint(data, rules, wildcard = defaultCard) {
    // Check current against rules
    for (const element of rules) {
        if (inputMatchFloat(data.input, element.input, wildcard)) {
            return outputMatch(data.output, element.output);
        }
    }

    return 0;
}

function checkFloatSet(data, rules, wildcard = defaultCard) {
    return data.reduce(
        (element, carry) => carry + checkFloatPoint(element, rules, wildcard), 0
    );
}

module.exports = {
    outputMatch,
    inputMatchInt,
    checkIntPoint,
    checkIntSet,
    inputMatchFloat,
    checkFloatPoint,
    checkFloatSet,
};
