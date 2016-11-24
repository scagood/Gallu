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
