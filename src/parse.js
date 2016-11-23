function buildData(data, format, structure) {
    var a;
    var b;
    var c;
    var current;
    format = new RegExp(format);

    for (a = 0; a < data.length; a++) {
        current = format.exec(data[a].trim());

        c = {input: [], output: []};
        for (b = 0; b < structure.length; b++) {
            if (typeof structure[b] === 'number') {
                if (structure[b] === 1 || structure[b] === true) {
                    c.input.push(parseFloat(current[b + 1]));
                } else {
                    c.output.push(parseFloat(current[b + 1]));
                }
            } else {
                throw new Error('Structure and Format incompatible');
            }
        }

        data[a] = c;
    }

    return data;
}
var parseDataFile = function (path, format, structure) {
    var a;

    // Read file
    var data = require('fs').readFileSync(path).toString();

    // Remove line feed
    data = data.replace(/\r/g, '');

    // Split into lines
    data = data.split('\n');

    // Remove empty lines
    for (a = 0; a < data.length; a++) {
        if (data[a] === '') {
            data.splice(a, 1);
            a--;
        }
    }

    // Remove the data descriptors
    data.shift();

    try {
        data = buildData(data, format, structure);
    } catch (err) {
        data = false;
    }

    return data;
};

module.exports = parseDataFile;
