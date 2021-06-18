"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const querystring_1 = tslib_1.__importDefault(require("querystring"));
const url_1 = tslib_1.__importDefault(require("url"));
const lookup_1 = require("./lookup");
const referers_1 = require("./referers");
tslib_1.__exportStar(require("./types"), exports);
const REFERERS = referers_1.loadDefault();
function Referer(refererURL, currentURL, referers) {
    this.known = false;
    this.referer = null;
    this.medium = 'unknown';
    this.searchParameter = null;
    this.searchTerm = null;
    this.referers = referers || REFERERS;
    const refererURI = url_1.default.parse(refererURL);
    const refererHost = refererURI.hostname;
    this.known = ['http:', 'https:'].includes(refererURI.protocol || '');
    this.uri = refererURI;
    if (!this.known)
        return;
    if (currentURL) {
        const currentURI = url_1.default.parse(currentURL);
        const currentHost = currentURI.hostname;
        if (currentHost === refererHost) {
            this.medium = 'internal';
            return;
        }
    }
    let referer = this.lookupReferer(refererHost, refererURI.pathname, true);
    if (!referer) {
        referer = this.lookupReferer(refererHost, refererURI.pathname, false);
        if (!referer) {
            this.medium = 'unknown';
            return;
        }
    }
    this.referer = referer.name;
    this.medium = referer.medium;
    if (referer.medium === 'search') {
        if (!referer.params)
            return;
        const pqs = querystring_1.default.parse(refererURI.query || '');
        const result = referer.params
            .map((d) => [d, pqs[d]])
            .filter(([, v]) => !!v)
            .reverse()[0];
        this.searchParameter = (result && result[0]) || null;
        this.searchTerm = (result && result[1]) || null;
    }
}
Referer.prototype.lookupReferer = function lookup(refererHost, refererPath, include_path) {
    return lookup_1.lookupReferer(this.referers, refererHost || '', refererPath || '', include_path);
};
exports.default = Referer;
//# sourceMappingURL=index.js.map