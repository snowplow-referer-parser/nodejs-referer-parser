import parser, { ParsedReferer } from './dist/fp';
const refererUrl = 'http://www.google.com/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari'

const parse = parser()
const r: ParsedReferer = parse(refererUrl)
console.log(r);

/* Result:
{
  uri: Url {
    protocol: 'http:',
    slashes: true,
    auth: null,
    host: 'www.google.com',
    port: null,
    hostname: 'www.google.com',
    hash: null,
    search: '?q=gateway+oracle+cards+denise+linn&hl=en&client=safari',
    query: 'q=gateway+oracle+cards+denise+linn&hl=en&client=safari',
    pathname: '/search',
    path: '/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari',
    href: 'http://www.google.com/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari'
  },
  known: true,
  referer: 'Google',
  medium: 'search',
  searchParameter: 'q',
  searchTerm: 'gateway oracle cards denise linn'
}
*/