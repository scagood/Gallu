var parse = function (data, format, structure) {
    var a;
    var result;
    var current;
    var results = [];
    format = new RegExp(format, 'g');

    for (a = 0; a < structure.length; a++) {
        if (typeof structure[a] === 'string') {
            current = structure[a].split('-');
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
            }
            switch (current[1].toLowerCase()) {
                case 'int':
                case 'integer':
                    structure[a].type = 'int';
                    break;
                case 'float':
                    structure[a].type = 'float';
                    break;
            }
        }
    }
    
    // Match all occurences of 'format'
    while (result = format.exec(data)) {
        current = {};
        current.data = result.slice(1, structure.length + 1);
        current.compile = {};
        
        // Convert raw 'match' into 'structure'
        for (a = 0; a < current.data.length; a++) {
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
                    break;
            }
            current.compile[structure[a].group].push(current.data[a]);
        }
        results.push(current.compile);
    }

    return results;
};

module.exports = parse;
