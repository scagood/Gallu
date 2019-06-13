const {promises: fs} = require('fs');
const GA = require('..');

const {parse} = GA;

let data;
const In = {
    type: 'float',
    group: 'input',
};
const Out = {
    type: 'int',
    group: 'output',
};

(async function () {
// Import dataset one
    data = await fs.readFile('data/data1.txt').toString();
    data = parse(data, '(0|1)(0|1)(0|1)(0|1)(0|1) (0|1)', [
        In, In, In, In, In, Out,
    ]);
    console.log(data);

    // Import dataset two
    data = await fs.readFile('data/data2.txt').toString();
    data = parse(data, '(0|1)(0|1)(0|1)(0|1)(0|1)(0|1) (0|1)', [
        In, In, In, In, In, In, Out,
    ]);
    console.log(data);

    // Import dataset three
    data = await fs.readFile('data/data3.txt').toString();
    data = parse(data, '([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) (0|1)', [
        In, In, In, In, In, In, Out,
    ]);
    console.log(data);
})();
