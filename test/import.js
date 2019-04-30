const fs = require('fs');
const GA = require('..');

const {parse} = GA;

let data;
const In = {
    type: 'float',
    group: 'input'
};
const Out = {
    type: 'int',
    group: 'output'
};

// Import dataset one
data = fs.readFileSync('data/data1.txt').toString();
data = parse(data, '(0|1)(0|1)(0|1)(0|1)(0|1) (0|1)', [In, In, In, In, In, Out]);
console.log(data);

// Import dataset two
data = fs.readFileSync('data/data2.txt').toString();
data = parse(data, '(0|1)(0|1)(0|1)(0|1)(0|1)(0|1) (0|1)', [In, In, In, In, In, In, Out]);
console.log(data);

// Import dataset three
data = fs.readFileSync('data/data3.txt').toString();
data = parse(data, '([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) ([0-9.]{8}) (0|1)', [In, In, In, In, In, In, Out]);
console.log(data);
