var Gallu =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var GA = __webpack_require__(1);
	var parse = __webpack_require__(8);
	var check = __webpack_require__(9);

	var arrayToRule = function (array, inputLength, outputLength, isFloat) {
	    var a;
	    var b;
	    var temp;
	    var rules = [];

	    inputLength *= (isFloat ? 2 : 1);

	    while (array.length > 0) {
	        temp = array.splice(0, inputLength + outputLength);

	        if (temp.length !== inputLength + outputLength) {
	            console.log(temp, inputLength, outputLength);
	            throw new Error('Length be wrong!');
	        }
	        rules.push({
	            input: temp.splice(0, inputLength),
	            output: temp.splice(0, outputLength)
	        });
	    }

	    if (isFloat === true) {
	        for (a = 0; a < rules.length; a++) {
	            temp = [];
	            while (rules[a].input.length > 0) {
	                b = [
	                    rules[a].input.shift(),
	                    rules[a].input.shift()
	                ];

	                // Force b[0] to be less tham b[1]
	                if (b[0] > b[1]) {
	                    b.push(b.shift());
	                }

	                // Add to new input
	                temp.push(b);
	            }
	            // Overwrite old rule input
	            rules[a].input = temp;
	        }
	    }

	    return rules;
	};

	module.exports = {
	    GA: GA,
	    parse: parse,
	    build: arrayToRule,
	    check: check

	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var belt = __webpack_require__(2);
	var crossover = __webpack_require__(7);

	// This is the data structure that will be used for each gene sequence
	var Person = function (seed, bounds) {
	    var a = 0;

	    this.data = [];
	    this.fitness = 0;

	    // Check to see if this entry is seeded
	    if (belt.compare.isArray(seed)) {
	        // There is a seed so use it.
	        this.data = seed;
	    } else if (isNaN(seed) === false) {
	        // Go through the gene length
	        while (a < seed) {
	            // Generate a random number (between the given bounds) and round it correctly to precision
	            this.data[a] = belt.generator.random(bounds.getMin(a), bounds.getMax(a));
	            this.data[a] = belt.maths.roundDP(this.data[a], bounds.getDP(a));
	            a++;
	        }
	    } else {
	        console.log(arguments);
	        throw new Error('Unknown Input');
	    }
	};

	// The GA 'class'
	var GA = function (poolSize, geneLength, seeds) {
	    var population = [];
	    var k = 0;

	    // The default 'bounds' functions
	    var bounds = {
	        getMin: function () {
	            return 0;
	        },
	        getMax: function () {
	            return 1;
	        },
	        getDP: function () {
	            return 0;
	        },
	        getCanWildcard: function () {
	            return 0;
	        }
	    };

	    // Evaluate
	    this.evaluate = function (callback) {
	        var a = 0;
	        var total = 0;
	        // For every person
	        while (a < population.length) {
	            // Test their fitness (callback is the test function)
	            population[a].fitness = callback(population[a].data);
	            total += population[a].fitness;
	            a++;
	        }

	        // Return the average fitness
	        return total / population.length;
	    };

	    // Crossover
	    this.crossover = function (crossoverProb, maxNum, minNum, shuffleFunc) {
	        // Preserve the old population till overwrite
	        var oldPopulation = population.slice(0);
	        var newPopulation = [];
	        var crossoverPoint;

	        var geneCount = oldPopulation.length;
	        var a;
	        var numberToCrossover;
	        var genes = [];

	        // Ensure all inputs are filled if not provided
	        crossoverProb = belt.compare.isDefined(crossoverProb) ? crossoverProb : {};
	        minNum = belt.compare.isDefined(minNum) ? minNum : 2;
	        maxNum = belt.compare.isDefined(maxNum) ? maxNum : 2;

	        crossoverProb.prob = belt.compare.isDefined(crossoverProb.prob) ? crossoverProb.prob : 0.8;
	        crossoverProb.ruleLength = belt.compare.isDefined(crossoverProb.ruleLength) ? crossoverProb.ruleLength : 1;
	        crossoverProb.low = belt.compare.isDefined(crossoverProb.low) ? crossoverProb.low : 0.6;
	        crossoverProb.high = belt.compare.isDefined(crossoverProb.high) ? crossoverProb.high : 0.9;
	        crossoverProb.count = belt.compare.isDefined(crossoverProb.count) ? crossoverProb.count : 1;

	        // For all the population
	        while (geneCount > 0) {
	            // How many should be crossed over
	            numberToCrossover = belt.generator.randomInt(maxNum, minNum);

	            // Clear previous crossover pool
	            genes = [];

	            // Prevent a single thing being not crossed over
	            if (geneCount - numberToCrossover < minNum && geneCount - numberToCrossover > 0) {
	                numberToCrossover += geneCount - numberToCrossover;
	            }

	            for (a = 0; a < numberToCrossover; a++) {
	                // Remove a gene from the old population and add it to the crossover pool
	                crossoverPoint = belt.generator.randomInt(oldPopulation.length - 1, 0);
	                crossoverPoint = oldPopulation.splice(crossoverPoint, 1)[0];
	                genes.push(crossoverPoint.data);
	                geneCount--;
	            }

	            crossoverPoint = [];
	            // Generate the crossover points
	            for (a = 0; a < crossoverProb.count; a++) {
	                crossoverPoint[a] = Math.random();
	                crossoverPoint[a] = belt.maths.probMap(crossoverPoint[a], crossoverProb.low, crossoverProb.high, crossoverProb.prob);
	                crossoverPoint[a] *= belt.compare.maxLen(genes) / crossoverProb.ruleLength;
	                crossoverPoint[a] = Math.round(crossoverPoint[a]);
	                crossoverPoint[a] *= crossoverProb.ruleLength;
	            }

	            // Do the crossover
	            genes = crossover(genes, crossoverPoint, shuffleFunc);

	            // Add the crossed over people to the new population
	            newPopulation = newPopulation.concat(genes);
	        }

	        // Make the crossed over children into people.
	        for (a = 0; a < newPopulation.length; a++) {
	            newPopulation[a] = new Person(newPopulation[a]);
	        }

	        // Overwrite the old population.
	        population = newPopulation;
	    };

	    // Mutation
	    this.mutate = function (prob, wildcard, wildprob, lenOfLenMutate, probOfLenMutate, lenMutateWeight) {
	        var a = 0;
	        var b;
	        var current;
	        var ruleGene;
	        var oldPopulation = population.slice(0);
	        var newPopulation = [];
	        var newRule = [];

	        // Ensure all inputs are filled if not provided
	        prob = belt.compare.isNumber(prob) ? prob : (1 / geneLength);
	        wildcard = belt.compare.isDefined(wildcard) ? wildcard : '#';
	        wildprob = belt.compare.isNumber(wildprob) ? wildprob : 0;
	        lenOfLenMutate = belt.compare.isNumber(lenOfLenMutate) ? lenOfLenMutate : 0;
	        lenOfLenMutate = Math.abs(lenOfLenMutate);
	        probOfLenMutate = belt.compare.isNumber(probOfLenMutate) ? probOfLenMutate : (1 / geneLength);
	        lenMutateWeight = belt.compare.isNumber(lenMutateWeight) ? lenMutateWeight : 0.5;

	        // For every person
	        while (a < population.length) {
	            // Remove a person from the old population
	            current = oldPopulation.pop();
	            // Extract the data from them.
	            current = current.data;

	            // Mutate Length
	            if (probOfLenMutate > Math.random()) {
	                b = 0;
	                if (Math.random() < lenMutateWeight) {
	                    // Additive
	                    newRule = [];
	                    // Generate the new rule.
	                    while (b < lenOfLenMutate) {
	                        // Generate a random number (between the given bounds) and round it correctly to precision
	                        ruleGene = belt.generator.random(bounds.getMin(b + current.length), bounds.getMax(b + current.length));
	                        ruleGene = belt.maths.roundDP(ruleGene, bounds.getDP(b + current.length));

	                        newRule[b] = ruleGene;
	                        b++;
	                    }
	                    // Add the rule into the current person, ensuring the data structure isn't broken
	                    current.splice.apply(current, [belt.generator.randomInt(0, current.length / lenOfLenMutate) * lenOfLenMutate, 0].concat(newRule));
	                } else if (lenOfLenMutate !== 0) {
	                    // Subtractive
	                    // Remove a rule from the current person, ensuring the data structure isn't broken
	                    current.splice(belt.generator.randomInt(0, current.length / lenOfLenMutate) * lenOfLenMutate, lenOfLenMutate);
	                }
	            }

	            b = 0;
	            // For each gene
	            while (b < current.length) {
	                // If this should be mutated
	                if (prob > Math.random()) {
	                    // If mutate to wildcard
	                    if (current[b] !== wildcard && wildprob > Math.random() && bounds.getCanWildcard(b) === 1) {
	                        // Go to wildcard
	                        current[b] = wildcard;
	                    } else {
	                        // Do the mutation
	                        current[b] = belt.generator.random(bounds.getMin(b), bounds.getMax(b));
	                        // Round to correct precision
	                        current[b] = belt.maths.roundDP(current[b], bounds.getDP(b));
	                    }
	                }
	                b++;
	            }
	            // Add the mutated person to the new population
	            newPopulation.push(new Person(current));
	            a++;
	        }
	        // Overwrite the old population with the new population
	        population = newPopulation;
	    };

	    // Selection
	    this.select = function (size) {
	        var newPopulation = [];
	        var people;
	        var current;
	        var best;
	        var a;
	        var b = population.length;

	        size = belt.compare.isDefined(size) ? size : 2;

	        // For every gene
	        while (b--) {
	            a = size;
	            people = [];
	            while (a--) {
	                // Select 'size' random people from the population
	                people.push(population[belt.generator.randomInt(population.length - 1, 0)]);
	            }

	            // Find the 'fitest' aka best person(s)
	            best = people[0];
	            for (a = 0; a < people.length; a++) {
	                current = people[a];
	                if (current.fitness > best.fitness) {
	                    best = current;
	                }
	            }

	            // Find all the 'fitest' people and select them
	            for (a = 0; a < people.length; a++) {
	                if (best.fitness !== people[a].fitness) {
	                    people.splice(a, 1);
	                }
	            }

	            best = people[0];
	            // Find the smallest and 'fitest' person and select them
	            for (a = 0; a < people.length; a++) {
	                current = people[a];
	                if (current.data.length < best.data.length) {
	                    best = current;
	                }
	            }

	            // Add the best person to the new population
	            newPopulation.push(best);
	        }

	        // Overwrite the old population with the new one.
	        population = newPopulation;
	    };

	    this.getBest = function () {
	        var s = population[0];
	        var a;

	        // Find all the 'fitest' people and select them
	        for (a = 0; a < population.length; a++) {
	            if (s.fitness < population[a].fitness) {
	                s = population[a];
	            }
	        }

	        // Find the smallest and 'fitest' person and select them
	        for (a = 0; a < population.length; a++) {
	            if (s.data.length > population[a].data.length && s.fitness === population[a].fitness) {
	                s = population[a];
	            }
	        }

	        // Return the best person.
	        return s;
	    };
	    this.getWorst = function (c) {
	        var s = population[0];
	        var t = 0;
	        var a = 0;

	        // Find the least 'fit' person
	        while (a < population.length) {
	            if (population[a].fitness < s.fitness) {
	                s = population[a];
	                t = a;
	            }
	            a++;
	        }
	        return c ? t : s;
	    };

	    this.setWorst = function (person) {
	        // Overwrite the lest 'fit' person with the previous 'fitest'
	        population[this.getWorst(true)] = person;
	    };

	    this.getTotalFitness = function () {
	        var s = 0;
	        var a = 0;
	        // Add all the fitnesses together.
	        while (a < population.length) {
	            s += population[a].fitness;
	            a++;
	        }
	        return s;
	    };
	    this.getAverageFitness = function () {
	        // Divide the total fitness by the number of people.
	        return this.getTotalFitness() / poolSize;
	    };

	    this.getAverageLength = function () {
	        var s = 0;
	        var a = 0;
	        // Add all the lengths together
	        while (a < population.length) {
	            s += population[a].data.length;
	            a++;
	        }
	        // Divide by the number of people.
	        return s / population.length;
	    };

	    this.getPopulation = function () {
	        // Return an unassociated population
	        return population.slice(0);
	    };

	    // Default set bound functions
	    this.setMin = function (min) {
	        if (belt.compare.isNumber(min)) {
	            bounds.getMin = function () {
	                return min;
	            };
	        } else if (belt.compare.isFunction(min)) {
	            bounds.getMin = min;
	        } else {
	            bounds.getMin = function () {
	                return 0;
	            };
	        }
	    };
	    this.setMax = function (max) {
	        if (belt.compare.isNumber(max)) {
	            bounds.getMax = function () {
	                return max;
	            };
	        } else if (belt.compare.isFunction(max)) {
	            bounds.getMax = max;
	        } else {
	            bounds.getMax = function () {
	                return 1;
	            };
	        }
	    };

	    this.setDP = function (precision) {
	        if (belt.compare.isNumber(precision)) {
	            bounds.getDP = function () {
	                return precision;
	            };
	        } else if (belt.compare.isFunction(precision)) {
	            bounds.getDP = precision;
	        } else {
	            bounds.getDP = function () {
	                return 0;
	            };
	        }
	    };
	    this.setCanWildcard = function (canWildcard) {
	        if (belt.compare.isNumber(canWildcard)) {
	            bounds.getCanWildcard = function () {
	                return canWildcard;
	            };
	        } else if (belt.compare.isFunction(canWildcard)) {
	            bounds.getCanWildcard = canWildcard;
	        } else {
	            bounds.getCanWildcard = function () {
	                return 0;
	            };
	        }
	    };

	    this.init = function () {
	        // Set seeds to empty if non are given
	        seeds = belt.compare.isDefined(seeds) ? seeds : [];
	        if (poolSize >= seeds.length) {
	            // For every seed
	            while (k < seeds.length) {
	                // Create a seeded person
	                population[k] = new Person(seeds[k], bounds);
	                k++;
	            }
	            // For the unseeded population
	            while (k < poolSize) {
	                // Create the rest of the unseeded people
	                population[k] = new Person(geneLength, bounds);
	                k++;
	            }
	        } else {
	            throw new Error('Too many seeds for the pool size.');
	        }
	    };
	};

	module.exports = GA;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var compare = __webpack_require__(3);
	var shuffle = __webpack_require__(4);
	var maths = __webpack_require__(5);
	var generator = __webpack_require__(6);

	module.exports = {
	    compare: compare,
	    generator: generator,
	    math: maths,
	    maths: maths,
	    shuffle: shuffle
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	// Compare Objects
	var compareObjectsComplex = function (o, p) {
	    var i;
	    var keysO = Object.keys(o).sort();
	    var keysP = Object.keys(p).sort();
	    if (keysO.length !== keysP.length) {
	        return false;
	    } // not the same nr of keys
	    if (keysO.join('') !== keysP.join('')) {
	        return false;
	    } // different keys
	    for (i = 0; i < keysO.length; ++i) {
	        if (o[keysO[i]] instanceof Array) {
	            if (!(p[keysO[i]] instanceof Array)) {
	                return false;
	            }
	            // if (compareObjectsComplex(o[keysO[i]], p[keysO[i]] === false) return false
	            // would work, too, and perhaps is a better fit, still, this is easy, too
	            if (p[keysO[i]].sort().join('') !== o[keysO[i]].sort().join('')) {
	                return false;
	            }
	        } else if (o[keysO[i]] instanceof Date) {
	            if (!(p[keysO[i]] instanceof Date)) {
	                return false;
	            }
	            if ((String(o[keysO[i]])) !== (String(p[keysO[i]]))) {
	                return false;
	            }
	        } else if (o[keysO[i]] instanceof Function) {
	            if (!(p[keysO[i]] instanceof Function)) {
	                return false;
	            }
	            // ignore functions, or check them regardless?
	        } else if (o[keysO[i]] instanceof Object) {
	            if (!(p[keysO[i]] instanceof Object)) {
	                return false;
	            }
	            if (o[keysO[i]] === o) { // self reference?
	                if (p[keysO[i]] !== p) {
	                    return false;
	                }
	            } else if (compareObjectsComplex(o[keysO[i]], p[keysO[i]]) === false) {
	                return false;
	            } // WARNING: does not deal with circular refs other than ^^
	        }
	        // change !== to != for loose comparison
	        if (o[keysO[i]] !== p[keysO[i]]) {
	            return false;
	        } // not the same value
	    }
	    return true;
	};
	var compareObjectsSimple = function (o, p) {
	    return JSON.stringify(o) === JSON.stringify(p);
	};

	// Simple Type Confirmations
	var isArray = function (test) {
	    var arrayType = Object.prototype.toString.call([]);
	    var testType = Object.prototype.toString.call(test);
	    return arrayType === testType;
	};
	var isDefined = function (test) {
	    return typeof test !== 'undefined';
	};
	var isFunction = function (test) {
	    var arrayType = Object.prototype.toString.call(function () {});
	    var testType = Object.prototype.toString.call(test);
	    return arrayType === testType;
	}
	var isNull = function (test) {
	    return test === null;
	};
	var isNumber = function (test) {
	    return !isNaN(test);
	};
	var isObject = function (test) {
	    var objectType = Object.prototype.toString.call({});
	    var testType = Object.prototype.toString.call(test);
	    return objectType === testType;
	};
	var isString = function (test) {
	    return typeof test !== 'string';
	};

	// Is a valid IP
	function isIPv4(ip) {
	    var ip4Regex = '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).' +
	        '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).' +
	        '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).' +
	        '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
	    ip4Regex = new RegExp(ip4Regex);

	    return ip4Regex.test(ip);
	}
	function isIPv6(ip) {
	    var ip6Regex = '(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|' +
	        '([0-9a-fA-F]{1,4}:){1,7}:|' +
	        '([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|' +
	        '([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|' +
	        '([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|' +
	        '([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|' +
	        '([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|' +
	        '[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|' +
	        ':((:[0-9a-fA-F]{1,4}){1,7}|:)|' +
	        'fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|' +
	        '::(ffff(:0{1,4}){0,1}:){0,1}' +
	        '((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}' +
	        '(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|' +
	        '([0-9a-fA-F]{1,4}:){1,4}:' +
	        '((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}' +
	        '(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))';
	    ip6Regex = new RegExp(ip6Regex);

	    return ip6Regex.test(ip);
	}

	// Get the heighest/lowest value in an int array
	var maxVal = function (array) {
	    var a;
	    var max = 0;
	    for (a in array) {
	        if ({}.hasOwnProperty.call(array, a) && array[a] > max) {
	            max = array[a];
	        }
	    }

	    return max;
	};
	var minVal = function (array) {
	    var a;
	    var min = array[Object.keys(array)[0]].length;

	    for (a in array) {
	        if ({}.hasOwnProperty.call(array, a) && min > array[a]) {
	            min = array[a];
	        }
	    }

	    return min;
	};

	// Get the longest/shortest
	var maxLen = function (array) {
	    var a;
	    var max = 0;
	    for (a in array) {
	        if ({}.hasOwnProperty.call(array, a)) {
	            max = (array[a].length < max) ? max : array[a].length;
	        }
	    }

	    return max;
	};
	var minLen = function (array) {
	    var a;
	    var min = array[Object.keys(array)[0]].length;

	    for (a in array) {
	        if ({}.hasOwnProperty.call(array, a)) {
	            min = (array[a].length > min) ? min : array[a].length;
	        }
	    }

	    return min;
	};

	module.exports = {
	    compareObjects: compareObjectsSimple,
	    compareObjectsComplex: compareObjectsComplex,
	    compareObjectsSimple: compareObjectsSimple,
	    isArr: isArray,
	    isArray: isArray,
	    isDef: isDefined,
	    isDefined: isDefined,
	    isFunc: isFunction,
	    isFunction: isFunction,
	    isNull: isNull,
	    isNum: isNumber,
	    isNumber: isNumber,
	    isObj: isObject,
	    isObject: isObject,
	    isStr: isString,
	    isString: isString,
	    isIP: isIPv4,
	    isIPv4: isIPv4,
	    isIPv6: isIPv6,
	    maxVal: maxVal,
	    minVal: minVal,
	    maxLen: maxLen,
	    minLen: minLen
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	// Random Range Derangements are disscussed here
	// http://epubs.siam.org/doi/pdf/10.1137/1.9781611972986.7

	// Derange implimentation by Paul Draper
	// http://stackoverflow.com/users/1212596/paul-draper
	var derangePD = function (array) {
	    function derangementNumber(n) {
	        if (n === 0) {
	            return 1;
	        }
	        var factorial = 1;
	        while (n) {
	            factorial *= n--;
	        }
	        return Math.floor(factorial / Math.E);
	    }
	    array = array.slice();
	    var mark = array.map(function () {
	        return false;
	    });
	    for (var i = array.length - 1, u = array.length - 1; u > 0; i--) {
	        if (!mark[i]) {
	            var unmarked = mark.map(function (_, i) {
	                return i;
	            }).filter(function (j) {
	                return !mark[j] && j < i;
	            });
	            var j = unmarked[Math.floor(Math.random() * unmarked.length)];

	            var tmp = array[j];
	            array[j] = array[i];
	            array[i] = tmp;

	            // this introduces the unbiased random characteristic
	            if (Math.random() < u * derangementNumber(u - 1) / derangementNumber(u + 1)) {
	                mark[j] = true;
	                u--;
	            }
	            u--;
	        }
	    }
	    return array;
	};

	// Derange implimentation by RobG
	// http://stackoverflow.com/users/257182/robg
	var derangeRG = function (arr) {
	    // Make a copy of arr
	    var c = arr.slice();

	    // If arr.length is < 2, return copy
	    if (c.length < 2) {
	        return c;
	    }

	    var result = [];
	    var idx;
	    var i;
	    var iLen;

	    // Keep track of whether last member has been moved
	    var lastMoved = false;

	    // Randomly remove a member of c, with conditions...
	    for (i = 0, iLen = c.length - 1; i < iLen; i++) {
	        // If get down to final two and last hasn't been moved,
	        // swap last two and append to result
	        if (c.length === 2 && !lastMoved) {
	            result = result.concat(c.reverse().splice(0, 2));
	            break;
	        }

	        // Otherwise, select a remaining member of c
	        do {
	            idx = Math.random() * c.length | 0;

	        // But make sure it's not going back in the same place
	        } while (arr.indexOf(c[idx]) === result.length);

	        // Add member to result
	        result.push(c.splice(idx, 1)[0]);

	        // Remember if last was just moved
	        lastMoved = lastMoved || idx === c.length;
	    }

	    // Add the last member, saves a do..while iteration about half the time
	    if (c.length === 0) {
	        result.push(c[0]);
	    }
	    return result;
	};

	// The following shuffle functions are from Mkie Bostock
	// https://bost.ocks.org/mike/shuffle/
	var decreasingDeck = function (array) {
	    array = array.slice();

	    var copy = [];
	    var n = array.length;
	    var i;

	    // While there remain elements to shuffle…
	    while (n) {
	        // Pick a remaining element…
	        i = Math.floor(Math.random() * n--);
	        // And move it to the new array.
	        copy.push(array.splice(i, 1)[0]);
	    }

	    return copy;
	};

	var randomElement = function (array) {
	    array = array.slice();

	    var copy = [];
	    var n = array.length;
	    var i;

	    // While there remain elements to shuffle…
	    while (n) {
	        // Pick a remaining element…
	        i = Math.floor(Math.random() * array.length);

	        // If not already shuffled, move it to the new array.
	        if (i in array) {
	            copy.push(array[i]);
	            delete array[i];
	            n--;
	        }
	    }

	    return copy;
	};

	var knuth = function (array) {
	    array = array.slice();

	    var m = array.length;
	    var t;
	    var i;

	    // While there remain elements to shuffle…
	    while (m) {
	        // Pick a remaining element…
	        i = Math.floor(Math.random() * m--);

	        // And swap it with the current element.
	        t = array[m];
	        array[m] = array[i];
	        array[i] = t;
	    }

	    return array;
	};

	module.exports = {
	    decreasingDeck: decreasingDeck,
	    derange: derangePD,
	    derangePD: derangePD,
	    derangeRG: derangeRG,
	    fisherYates: knuth,
	    knuth: knuth,
	    randomElement: randomElement
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var comp = __webpack_require__(3);

	// Simple mapping
	var map = function (old, fMin, fMax, tMin, tMax) {
	    return ((old - fMin) * (tMax - tMin) / (fMax - fMin)) + tMin;
	};
	var probMap = function (old, low, high, prob) {
	    low = comp.isDef(low) ? low : 0;
	    high = comp.isDef(high) ? high : 1;
	    prob = comp.isDef(prob) ? prob : 1;
	    var res;
	    if (old < (0.5 - (prob / 2))) {
	        res = map(old, 0, (0.5 - (prob / 2)), 0, low);
	    } else if (old > (0.5 - (prob / 2)) && old < (0.5 + (prob / 2))) {
	        res = map(old, (0.5 - (prob / 2)), (0.5 + (prob / 2)), low, high);
	    } else if (old > (0.5 + (prob / 2))) {
	        res = map(old, (0.5 + (prob / 2)), 1, high, 1);
	    } else {
	        res = false;
	    }
	    return res;
	};

	// Shift an out of bounds number back into bounds.
	var moveToBounds = function (old, min, max) {
	    while (old > max || old < min) {
	        if (old < min) {
	            old = min + (min - old);
	        } else {
	            old = max - (old - max);
	        }
	    }
	    return old;
	};

	// Rounding functions
	var roundDP = function (number, precision) {
	    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision);
	};
	var roundSF = function (number, precision) {
	    return number.toPrecision(precision);
	};

	// Pythag theorum
	var pythag = function (x, y) {
	    x = Math.pow(x, 2);
	    y = Math.pow(y, 2);
	    return Math.pow(x + y, 0.5);
	};

	// Convert angles
	var toDegrees = function (angle) {
	    return angle * (180 / Math.PI);
	};
	var toRadians = function (angle) {
	    return angle * (Math.PI / 180);
	};

	// Distance and Angle between 2 points
	var distance = function (x1, y1, x2, y2) {
	    return pythag(x2 - x1, y2 - y1);
	};
	var angle = function (x1, y1, x2, y2) {
	    return Math.atan2(x1 - x2, y1 - y2);
	};

	// Convert between Polar and Cartesian Coordinates
	var toPolar = function (x, y) {
	    var r = distance(0, 0, x, y);
	    var theta = angle(0, 0, x, y);

	    return {
	        r: r,
	        theta: theta,
	        thetaDeg: toDegrees(theta),
	        thetaRads: theta
	    };
	};
	var toCartesian = function (r, theta, radians) {
	    radians = comp.isDef(radians) ? radians : true;

	    if (!radians) {
	        theta = toRadians(theta);
	    }

	    var x = r * Math.cos(theta);
	    var y = r * Math.sin(theta);

	    return {
	        x: x,
	        y: y
	    };
	};

	// Cosine Rule all in Radians
	var cosineRuleLength = function (a, b, C) { // Return c
	    // c = (a^2 + b^2 - 2*a*b*cos(C))^0.5
	    var c = 2 * a * b * Math.cos(C);
	    c = Math.pow(a, 2) + Math.pow(b, 2) - c;
	    return Math.pow(c, 0.5);
	};
	var cosineRuleAngle = function (a, b, c) { // Returns A
	    // acos((b^2 + c^2 - a^2)/(2*b*c)) = A
	    var top = Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2);
	    var bottom = 2 * b * c;
	    return bottom === 0 ? Math.PI / 2 : Math.acos(top / bottom);
	};

	// Sine Rule all in Radians
	var sineRuleLength = function (a, A, B) { // Returns b
	    // sin(A)/a = sin(B)/b = sin(C)/c
	    return Math.sin(A) / (a * Math.sin(B));
	};
	var sineRuleAngle = function (a, A, b) { // Returns B
	    // sin(A)/a = sin(B)/b = sin(C)/c
	    return Math.asin(b * (Math.sin(A) / a));
	};

	module.exports = {
	    map: map,
	    probMap: probMap,
	    moveToBounds: moveToBounds,
	    roundDP: roundDP,
	    roundSF: roundSF,
	    pythag: pythag,
	    toDegrees: toDegrees,
	    toRadians: toRadians,
	    distance: distance,
	    angle: angle,
	    toPolar: toPolar,
	    toCartesian: toCartesian,
	    cosineRuleLength: cosineRuleLength,
	    cosineRuleAngle: cosineRuleAngle,
	    sineRuleLength: sineRuleLength,
	    sineRuleAngle: sineRuleAngle
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var comp = __webpack_require__(3);

	var isDef = comp.isDef;
	var random = function (min, max) {
	    min = isDef(max) ? min : 0;
	    max = isDef(max) ? max : isDef(min) ? min : 1;
	    return (Math.random() * (max - min)) + min;
	};
	var randomInt = function (max, min) {
	    max = isDef(max) ? Math.round(max) : 1;
	    min = isDef(min) ? Math.round(min) : 0;

	    return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	var randomArray = function (size, depth, min, max) {
	    var out = [];
	    var arr;
	    var a;
	    while (size--) {
	        arr = [];
	        a = depth;
	        while (a--) {
	            arr.push(randomInt(max, min));
	        }
	        out.push(arr);
	    }

	    return out;
	};

	module.exports = {
	    rand: random,
	    randArray: randomArray,
	    randInt: randomInt,
	    random: random,
	    randomArray: randomArray,
	    randomInt: randomInt
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var belt = __webpack_require__(2);

	var crossover = function (rabbits, crossover, shuffle) {
	    var kits = [];
	    var gore = [];
	    var a;
	    var b;
	    var c;
	    var d;

	    // Check Inputs
	    // Check crossover and correct if possible
	    crossover = belt.compare.isArray(crossover) ? crossover : (isNaN(crossover) === false) ? [crossover] : null;

	    // Check parents are an array
	    if (crossover === null || !belt.compare.isArray(rabbits)) {
	        return false;
	    }

	    // If crossover points are not numbers end.
	    for (a in crossover) {
	        if ({}.hasOwnProperty.call(crossover, a) && isNaN(crossover[a])) {
	            return false;
	        }
	    }

	    // If rabbits are not rabbits.
	    for (a in rabbits) {
	        if ({}.hasOwnProperty.call(rabbits, a) && !belt.compare.isArray(rabbits[a])) {
	            return false;
	        }
	    }

	    // Add 0 to crossover points
	    if (crossover[0] !== 0) {
	        crossover.unshift(0);
	    }

	    // Initialise the number of parts to cut the rabbits into
	    a = crossover.length;
	    while (a--) {
	        gore.push([]);
	    }

	    // Determin how shuffle the rabbit parts around
	    shuffle = belt.compare.isDefined(shuffle) ? shuffle : belt.shuffle.derange;

	    // Cut the rabbits into pieces
	    for (a in rabbits) {
	        if ({}.hasOwnProperty.call(rabbits, a)) {
	            // Cut the rabbits partCount times
	            for (b = 0; b < crossover.length; b++) {
	                gore[b][a] = rabbits[a].slice(crossover[b], belt.compare.isDefined(crossover[b + 1]) ? crossover[b + 1] : rabbits[a].length);
	            }

	            // Initialise the kits array
	            kits[a] = [];
	        }
	    }

	    // Part to not shuffle
	    b = belt.generator.randomInt(gore.length - 1, 0);
	    // Array IDs are strings.
	    b = b.toString();

	    // Shuffle the correct parts
	    for (a in gore) {
	        if ({}.hasOwnProperty.call(gore, a) && a !== b) {
	            // Convert array to shuffle into keys.
	            d = true;
	            c = Object.keys(gore[a]);

	            c = shuffle(c);

	            // Convert keys to array
	            for (d = 0; d < c.length; d++) {
	                c[d] = gore[a][c[d]];
	            }

	            gore[a] = c;
	        }
	    }

	    // Sow the heads and tails to gether
	    for (a in gore) {
	        if ({}.hasOwnProperty.call(gore, a)) {
	            for (b in gore[a]) {
	                if ({}.hasOwnProperty.call(gore[a], b)) {
	                    kits[b] = kits[b].concat(gore[a][b]);
	                }
	            }
	        }
	    }

	    // Clear memory
	    gore = [];

	    return kits;
	};

	module.exports = crossover;


/***/ },
/* 8 */
/***/ function(module, exports) {

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


/***/ },
/* 9 */
/***/ function(module, exports) {

	function inputMatchInt(data, rule, wildcard) {
	    var matching = true;
	    var a;

	    wildcard = typeof wildcard === 'undefined' ? '#' : wildcard;

	    for (a = 0; a < data.length; a++) {
	        if (rule[a] !== wildcard && data[a] !== rule[a]) {
	            matching = false;
	            break;
	        }
	    }

	    return matching;
	}
	function inputMatchFloat(data, rule, wildcard) {
	    var matching = true;
	    var a;

	    wildcard = typeof wildcard === 'undefined' ? '#' : wildcard;

	    for (a = 0; a < data.length; a++) {
	        if (
	            !(rule[a][0] < data[a] && data[a] < rule[a][1]) &&
	            !(rule[a][0] === wildcard || rule[a][1] === wildcard)
	        ) {
	            matching = false;
	            break;
	        }
	    }

	    return matching;
	}
	function outputMatch(data, rule) {
	    var matching = 1;
	    var a;

	    for (a = 0; a < data.length; a++) {
	        if (data[a] !== rule[a]) {
	            matching = 0;
	            break;
	        }
	    }

	    return matching;
	}
	function checkDataPoint(data, rules, wildcard, isFloat) {
	    var a;
	    isFloat = typeof isFloat === 'undefined' ? false : isFloat;

	    // Check current against rules
	    for (a = 0; a < rules.length; a++) {
	        if (
	            (isFloat === false && inputMatchInt(data.input, rules[a].input, wildcard)) ||
	            (isFloat === true && inputMatchFloat(data.input, rules[a].input, wildcard))
	        ) {
	            return outputMatch(data.output, rules[a].output);
	        }
	    }
	    return 0;
	}
	var checkDataSet = function (data, rules, wildcard, isFloat) {
	    var a;
	    var fitness = 0;

	    // For every data point
	    for (a = 0; a < data.length; a++) {
	        fitness += checkDataPoint(data[a], rules, wildcard, isFloat);
	    }

	    return fitness;
	};

	module.exports = checkDataSet;


/***/ }
/******/ ]);