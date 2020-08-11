"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupReferer = exports.buildLookup = void 0;
exports.buildLookup = (referers) => {
    const lookup = (refererHost, refererPath, includePath) => {
        const withPath = (host, p) => referers[host + p];
        const justHost = (host) => referers[host];
        const deepPath = (host, splitted) => splitted.length > 1 ? referers[`${host}/${splitted[1]}`] : null;
        const look = () => (includePath ? withPath(refererHost, refererPath) : justHost(refererHost));
        const deep = () => (includePath ? deepPath(refererHost, refererPath.split('/')) : null);
        const sliced = () => {
            const idx = refererHost.indexOf('.');
            if (idx === -1)
                return null;
            const slicedHost = refererHost.slice(idx + 1);
            return lookup(slicedHost, refererPath, includePath);
        };
        return look() || deep() || sliced();
    };
    return lookup;
};
exports.lookupReferer = (referers, refererHost, refererPath, includePath) => exports.buildLookup(referers)(refererHost, refererPath, includePath);
//# sourceMappingURL=lookup.js.map