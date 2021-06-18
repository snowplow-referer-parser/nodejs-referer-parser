# referer-parser node.js (JavaScript) library

This is the node.js (JavaScript) implementation of [referer-parser][referer-parser], the library for extracting search marketing data from referer _(sic)_ URLs.

The implementation uses the shared 'database' of known referers found in [`referers.yml`][referers-yml]

The Javascript version of referer-parser is maintained by [Martin Katrenik][mkatrenik].

## Installation

    npm install referer-parser

## Usage

Create a new instance of a Referer object by passing in the url you want to parse:

```js
var Referer = require('referer-parser')

refererUrl = 'http://www.google.com/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari'

var r = new Referer(refererUrl)
```

The `r` variable now holds a Referer instance.  The important attributes are:

```js
console.log(r.known)              // true
console.log(r.referer)            // 'Google'
console.log(r.medium)             // 'search'
console.log(r.searchParameter)    // 'q'
console.log(r.searchTerm)         // 'gateway oracle cards denise linn'
console.log(r.uri)                // result of require('url').parse(...)
```

Optionally, pass in the current URL as well, to handle internal referers

```js
var Referer = require('referer-parser')

var refererUrl = 'http://www.snowplowanalytics.com/about/team'
var currentUrl = 'http://www.snowplowanalytics.com/account/profile'

var r = Referer(refererUrl, currentUrl)
```

The attributes would be

```js
console.log(r.known)              // true
console.log(r.referer)            // null
console.log(r.medium)             // 'internal'
console.log(r.searchParameter)    // null
console.log(r.searchTerm)         // null
console.log(r.uri)                // result of require('url').parse(...) (url.UrlWithStringQuery)
```

## FP Implementation

call the parse function the url you want to parse:

```js
import parser from ('referer-parser/fp')
const parse = parser() // optionall load custom referers like /data/referers.json

refererUrl = 'http://www.google.com/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari'

var r = parser(refererUrl)
```

The `r` variable now holds a `ParsedReferer` instance.  The important attributes are:

```js
console.log(r.known)              // true
console.log(r.referer)            // 'Google'
console.log(r.medium)             // 'search'
console.log(r.searchParameter)    // 'q'
console.log(r.searchTerm)         // 'gateway oracle cards denise linn'
console.log(r.uri)                // result of require('url').parse(...)
```

A `ParsedReferer` contains the following attributes and types:

```js
interface ParsedReferer {
  uri: url.UrlWithStringQuery | null;
  known: boolean;
  referer: string | null;
  medium: string | null;
  searchParameter: string | string[] | null;
  searchTerm: string | string[] | null;
}

// can be imported as:
import { ParsedReferer } from ('referer-parser/types')
```

Optionally, pass in the current URL as well, to handle internal referers

```js
import parser from ('referer-parser/fp')
const parse = parser() // optionall load custom referers like /data/referers.json

var refererUrl = 'http://www.snowplowanalytics.com/about/team'
var currentUrl = 'http://www.snowplowanalytics.com/account/profile'

const r = parse(refererUrl, currentUrl)
```

The attributes would be

```js
console.log(r.known)              // true
console.log(r.referer)            // null
console.log(r.medium)             // 'internal'
console.log(r.searchParameter)    // null
console.log(r.searchTerm)         // null
console.log(r.uri)                // result of require('url').parse(...) (url.UrlWithStringQuery)
```

## Run the examples

Run the examples with ts-node, so install all dependencies:
`npm install`

and then execute the example you want with
`npx ts-node [examplefile]`:

- `npx ts-node example.ts`
- `npx ts-node example.fp.ts`
- `npx ts-node example.prototype.ts`

## Copyright and license

The referer-parser node.js (JavaScript) library is copyright 2013 Martin Katrenik.

Licensed under the [Apache License, Version 2.0][license] (the "License");
you may not use this software except in compliance with the License.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

[referer-parser]: https://github.com/snowplow/referer-parser
[referers-yml]: https://github.com/snowplow/referer-parser/blob/master/referers.yml

[mkatrenik]: https://github.com/mkatrenik

[license]: http://www.apache.org/licenses/LICENSE-2.0
