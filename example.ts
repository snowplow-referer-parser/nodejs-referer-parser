import Referer, { ParsedRefererObject } from './dist';
import parser, { ParsedReferer } from './dist/fp';
const refererUrl = 'http://www.google.com/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari'

// Prototype Based:
const second: ParsedRefererObject = new Referer(refererUrl)
console.log(second);

// FP implementation
const parse = parser()
const first: ParsedReferer = parse(refererUrl)
console.log(first);
