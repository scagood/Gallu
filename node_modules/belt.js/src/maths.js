var comp = require('./compare');

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
