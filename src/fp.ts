import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import querystring from 'querystring';
import url from 'url';

interface RefererSourceParameters {
  domains: string[];
  parameters?: string[];
}

type RefererSourceEntry = Record<string, RefererSourceParameters>;
type RefererSource = Record<string, RefererSourceEntry>;

interface RefererParams {
  name: string;
  medium: string;
  params: string[];
}

function loadReferers(source: RefererSource): Record<string, RefererParams> {
  return Object.entries(source)
    .map(([medium, conf_list]) =>
      Object.entries(conf_list).map(([referer_name, config]): [string, RefererParams][] =>
        config.domains.map((domain) => [
          domain,
          {
            name: referer_name,
            medium,
            params: config.parameters ? config.parameters.map((s) => s.toLowerCase()) : [],
          },
        ])
      )
    )
    .reduce((p, c) => [...p, ...c], [])
    .reduce((p, c) => [...p, ...c], [])
    .reduce((p, [domain, params]) => ({ ...p, [domain]: params }), {});
}

const dataFile = fs.readFileSync(path.join(__dirname, '..', 'data', 'referers.yml'));
const REFERERS = loadReferers(yaml.load(dataFile.toString(), { json: true }));

const buildLookup = (referers: Record<string, RefererParams>) => {
  const lookup = (refererHost: string, ref_path: string, include_path: boolean): RefererParams | null => {
    const basic: RefererParams | null = include_path
      ? referers[refererHost + ref_path] ||
        referers[refererHost] ||
        (ref_path.split('/').length > 1 && referers[`${refererHost}/${ref_path.split('/')[1]}`])
      : null;
    if (basic) return basic;

    try {
      const idx = refererHost.indexOf('.');
      if (idx === -1) return null;

      const slicedHost = refererHost.slice(idx + 1);
      return lookup(slicedHost, ref_path, include_path);
    } catch (e) {
      return null;
    }
  };
  return lookup;
};

interface ParsedReferer {
  uri: url.UrlWithStringQuery | null;
  known: boolean;
  referer: string | null;
  medium: string | null;
  searchParameter: string | string[] | null;
  searchTerm: string | string[] | null;
}

const emptyReferer = {
  uri: null,
  known: false,
  referer: null,
  medium: null,
  searchParameter: null,
  searchTerm: null,
};

type Parse = (
  referers?: Record<string, RefererParams>
) => (currentUrl?: string | null) => (refererUrl: string) => ParsedReferer;

const parse: Parse = (referers = REFERERS) => {
  const lookupReferer = buildLookup(referers);
  return (currentUrl: string | null = null) => {
    const internal = url.parse(currentUrl || '').hostname;

    return (refererUrl: string): ParsedReferer => {
      const refUri = url.parse(refererUrl);
      const refHost = refUri.hostname || '';

      const isInternal = currentUrl && refHost === internal;

      const known = ['http:', 'https:'].includes(refUri.protocol || '');
      if (!known || isInternal)
        return {
          ...emptyReferer,
          uri: refUri,
          known,
          medium: isInternal ? 'internal' : 'unknown',
        };

      const referer =
        lookupReferer(refHost, refUri.pathname || '', true) || lookupReferer(refHost, refUri.pathname || '', false);
      if (!referer)
        return {
          ...emptyReferer,
          uri: refUri,
          known,
          medium: 'unknown',
        };

      if (referer.medium === 'search' && referer.params) {
        const pqs = querystring.parse(refUri.query || '');
        const result = referer.params
          .map((d: string) => [d, pqs[d]])
          .filter(([, v]) => !!v)
          .reverse()[0];

        return {
          uri: refUri,
          known,
          referer: referer.name,
          medium: referer.medium,
          searchParameter: (result && result[0]) || null,
          searchTerm: (result && result[1]) || null,
        };
      }
      return {
        ...emptyReferer,
        uri: refUri,
        known,
        referer: referer.name,
        medium: referer.medium,
      };
    };
  };
};

export default parse;
