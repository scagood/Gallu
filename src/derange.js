const markMap = (_, i) => i;
function derangeNum(number) {
    if (number === 0) {
        return 1;
    }

    let factorial = 1;

    while (number) {
        factorial *= number--;
    }

    return Math.floor(factorial / Math.E);
}

// Random Range Derangements are disscussed here
// http://epubs.siam.org/doi/pdf/10.1137/1.9781611972986.7

function derange(input, random = Math.random) {
    const array = input.slice();
    const mark = array.map(() => false);

    let tailMark = array.length - 1
    for (let count = array.length - 1; tailMark > 0; count--) {
        if (mark[count]) {
            continue;
        }

        // Find unmarked
        let unmarked = mark
            .map(markMap)
            .filter(j => !mark[j] && j < count);

        // Get random unmarked
        const j = unmarked[Math.floor(random() * unmarked.length)];

        // Swap the entries
        [array[count], array[j]] = [array[j], array[count]];

        // this introduces the unbiased random characteristic
        if (random() < tailMark * derangeNum(tailMark - 1) / derangeNum(tailMark + 1)) {
            // Randomly decide to mark the entry
            mark[j] = true;
            tailMark--;
        }
        tailMark--;
    }
    return array;
};

module.exports = derange;
module.exports.markMap = markMap;
module.exports.derangeNum = derangeNum;
