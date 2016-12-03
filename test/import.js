var fs = require('fs');
var GA = require('../');

var parse = GA.parse;

var data;
var In = {
    type: 'float',
    group: 'input'
};
var Out = {
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
