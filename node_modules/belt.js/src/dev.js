var comp = require('./compare');
var math = require('./maths');

var trigonometry = function (input) {
    var typeDetect = '';
    var output = {
        a: input.a,
        b: input.b,
        c: input.c,
        A: input.A,
        B: input.B,
        C: input.C
    };

    // Convert inputs into a binary string.
    typeDetect += comp.isNum(input.a) ? '1' : '0';
    typeDetect += comp.isNum(input.b) ? '1' : '0';
    typeDetect += comp.isNum(input.c) ? '1' : '0';
    typeDetect += comp.isNum(input.A) ? '1' : '0';
    typeDetect += comp.isNum(input.B) ? '1' : '0';
    typeDetect += comp.isNum(input.C) ? '1' : '0';

    switch (typeDetect) {
        case '111000':
            // cosine 3 times
            output.A = math.cosineRuleAngle(input.a, input.b, input.c);
            output.B = math.cosineRuleAngle(input.b, input.a, input.c);
            output.C = math.cosineRuleAngle(input.c, input.a, input.b);
            break;
        case '110100':
            break;
        case '110010':
            break;
        case '110001':
            break;
        default:
            output.error = 'Not enough information';
            break;

    }
};

/* Random string gen from php
function randomString($length = 8) {
    $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    $string = array(); //remember to declare $string as an array
    $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
    for ($i = 0; $i < $length; $i++) {
        $n = rand(0, $alphaLength);
        $string[] = $alphabet[$n];
    }
    return implode($string); //turn the array into a string
}
*/

module.exports = {
    trigonometry: trigonometry
};
