const {AssertionError, deepEqual} = require('assert').strict;

function worstReduce(carry, current) {
    if (typeof carry === 'undefined') {
        return current;
    }

    if (current.fitness < carry.fitness) {
        return current;
    }

    return carry;
}

function bestReduce(carry, current) {
    if (typeof carry === 'undefined') {
        return current;
    }

    if (current.fitness > carry.fitness) {
        return current;
    }

    return carry;
}

function largestWorstReduce(carry, current) {
    if (typeof carry === 'undefined') {
        return current;
    }

    if (current.fitness < carry.fitness) {
        return current;
    }

    if (
        carry.fitness === current.fitness &&
        carry.data.length < current.data.length
    ) {
        return current;
    }

    return carry;
}

function smallestBestReduce(carry, current) {
    if (typeof carry === 'undefined') {
        return current;
    }

    if (current.fitness > carry.fitness) {
        return current;
    }

    if (
        carry.fitness === current.fitness &&
        carry.data.length > current.data.length
    ) {
        return current;
    }

    return carry;
}

function findDeep(target) {
    return function (current) {
        try {
            deepEqual(target, current);
            return true;
        } catch (error) {
            if (error instanceof AssertionError) {
                return false;
            }

            throw error;
        }
    };
}

module.exports = {
    worstReduce,
    bestReduce,
    largestWorstReduce,
    smallestBestReduce,
    findDeep,
};
