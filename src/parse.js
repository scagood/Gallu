function parse(data, format, structure) {
    for (let a = 0; a < structure.length; a++) {
        if (typeof structure[a] === 'string') {
            const current = structure[a].split('-');
            structure[a] = {};
            switch (current[0].toLowerCase()) {
            case 'in':
            case 'input':
                structure[a].group = 'input';
                break;
            case 'out':
            case 'output':
                structure[a].group = 'output';
                break;
            default:
                throw new Error('Must be either an input or an output');
            }

            switch (current[1].toLowerCase()) {
            case 'int':
            case 'integer':
                structure[a].type = 'int';
                break;
            case 'float':
                structure[a].type = 'float';
                break;
            default:
                throw new Error('Unknown or Unimplimented data type');
            }
        }
    }

    const results = [];
    const regex = new RegExp(format, 'g');
    let result = regex.exec(data);
    while (result) {
        const current = {};
        current.data = result.slice(1, structure.length + 1);
        current.compile = {};

        // Convert raw 'match' into 'structure'
        for (let a = 0; a < current.data.length; a++) {
            // Create the groups in not defined
            if (typeof current.compile[structure[a].group] === 'undefined') {
                current.compile[structure[a].group] = [];
            }

            // Convert the 'string' to the correct data 'type'
            switch (structure[a].type) {
            case 'int':
            case 'float':
                current.data[a] = parseFloat(current.data[a]);
                break;
            default:
                throw new Error('Unknown or Unimplimented data type');
            }

            current.compile[structure[a].group].push(current.data[a]);
        }

        results.push(current.compile);
        result = regex.exec(data);
    }

    return results;
};

module.exports = parse;
