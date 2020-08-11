"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const querystring_1 = tslib_1.__importDefault(require("querystring"));
const url_1 = tslib_1.__importDefault(require("url"));
const lookup_1 = require("./lookup");
const referers_1 = require("./referers");
const types_1 = require("./types");
tslib_1.__exportStar(require("./types"), exports);
const extractSearchParameters = (referer, refererURI) => {
    if (!referer || referer.medium !== 'search' || !referer.params)
        return { searchParameter: null, searchTerm: null };
    const pqs = querystring_1.default.parse(refererURI.query || '');
    const result = referer.params
        .map((d) => [d, pqs[d]])
        .filter(([, v]) => !!v)
        .reverse()[0];
    return {
        searchParameter: (result && result[0]) || null,
        searchTerm: (result && result[1]) || null,
    };
};
const checkInternal = (currentUrl, refererHost) => {
    const internal = url_1.default.parse(currentUrl || '').hostname;
    const isInternal = currentUrl && refererHost === internal;
    return isInternal ? 'internal' : null;
};
const extractKnown = (refererURI) => ['http:', 'https:'].includes(refererURI.protocol || '');
const extractReferer = (referers) => {
    const lookupReferer = lookup_1.buildLookup(referers);
    return (refererHost, refererURI) => lookupReferer(refererHost, refererURI.pathname || '', true) ||
        lookupReferer(refererHost, refererURI.pathname || '', false);
};
function parser(referers) {
    const refs = referers || referers_1.loadDefault();
    const lookup = extractReferer(refs);
    return (refererURL, currentUrl = null) => {
        const refererURI = url_1.default.parse(refererURL);
        const refererHost = refererURI.hostname || '';
        const referer = lookup(refererHost, refererURI);
        return {
            ...types_1.emptyReferer,
            uri: refererURI,
            known: extractKnown(refererURI),
            medium: checkInternal(currentUrl, refererHost) || (referer === null || referer === void 0 ? void 0 : referer.medium) || 'unknown',
            referer: (referer === null || referer === void 0 ? void 0 : referer.name) || null,
            ...extractSearchParameters(referer, refererURI),
        };
    };
}
exports.default = parser;
//# sourceMappingURL=fp.js.map