import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { RefererParams, RefererSource, RefererSourceParameters } from './types';

function flatten<A>(p: A[], c: A[]): A[] {
  return [...p, ...c];
}

const buildRefererParams = (medium: string) => (name: string) => (params: string[]): RefererParams => ({
  name,
  medium,
  params,
});

type ParamBuilder = (params: string[]) => RefererParams;
type NameBuilder = (name: string) => ParamBuilder;
type ParameterTuple = [string, RefererParams];

const addParams = (builder: ParamBuilder) => (parameters: string[] = []) =>
  builder(parameters.map((s) => s.toLowerCase()));

const crunchConfig = (builder: ParamBuilder) => (config: RefererSourceParameters): ParameterTuple[] => {
  const named = addParams(builder);
  return config.domains.map((domain) => [domain, named(config.parameters)]);
};

const crunchConfigTuple = (builder: NameBuilder) => ([name, config]: [
  string,
  RefererSourceParameters
]): ParameterTuple[] => {
  const crunch = crunchConfig(builder(name));
  return crunch(config);
};

const crunchConfigList = (builder: NameBuilder) => (
  list: Record<string, RefererSourceParameters>
): ParameterTuple[] => {
  const crunch = crunchConfigTuple(builder);
  return Object.entries(list).map(crunch).reduce(flatten);
};

const crunchRefererParams = ([medium, configs]: [string, Record<string, RefererSourceParameters>]) =>
  crunchConfigList(buildRefererParams(medium))(configs);

export function loadReferers(source: RefererSource): Record<string, RefererParams> {
  return Object.entries(source)
    .map(crunchRefererParams)
    .reduce(flatten, [])
    .reduce((p, [domain, params]) => ({ ...p, [domain]: params }), {});
}

export function loadDefault(): Record<string, RefererParams> {
  const dataFile = fs.readFileSync(path.join(__dirname, '..', 'data', 'referers.yml'));
  return loadReferers(yaml.load(dataFile.toString(), { json: true }));
}
