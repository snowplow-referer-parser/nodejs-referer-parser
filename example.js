var dist_1 = require('./dist');
var fp_1 = require('./dist/fp');
var refererUrl = 'http://www.google.com/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari';
// Prototype Based:
var second = new dist_1["default"](refererUrl);
console.log(second);
// FP implementation
var parse = fp_1["default"]();
var first = parse(refererUrl);
console.log(first);
