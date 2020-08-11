"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDefault = exports.loadReferers = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const js_yaml_1 = tslib_1.__importDefault(require("js-yaml"));
const path_1 = tslib_1.__importDefault(require("path"));
function flatten(p, c) {
    return [...p, ...c];
}
const buildRefererParams = (medium) => (name) => (params) => ({
    name,
    medium,
    params,
});
const addParams = (builder) => (parameters = []) => builder(parameters.map((s) => s.toLowerCase()));
const crunchConfig = (builder) => (config) => {
    const named = addParams(builder);
    return config.domains.map((domain) => [domain, named(config.parameters)]);
};
const crunchConfigTuple = (builder) => ([name, config]) => {
    const crunch = crunchConfig(builder(name));
    return crunch(config);
};
const crunchConfigList = (builder) => (list) => {
    const crunch = crunchConfigTuple(builder);
    return Object.entries(list).map(crunch).reduce(flatten);
};
const crunchRefererParams = ([medium, configs]) => crunchConfigList(buildRefererParams(medium))(configs);
function loadReferers(source) {
    return Object.entries(source)
        .map(crunchRefererParams)
        .reduce(flatten, [])
        .reduce((p, [domain, params]) => ({ ...p, [domain]: params }), {});
}
exports.loadReferers = loadReferers;
function loadDefault() {
    const dataFile = fs_1.default.readFileSync(path_1.default.join(__dirname, '..', 'data', 'referers.yml'));
    return loadReferers(js_yaml_1.default.load(dataFile.toString(), { json: true }));
}
exports.loadDefault = loadDefault;
//# sourceMappingURL=referers.js.map