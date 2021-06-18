import Referer, { ParsedRefererObject } from './dist';
const refererUrl = 'http://www.google.com/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari'

const r: ParsedRefererObject = new Referer(refererUrl)
console.log(r);
