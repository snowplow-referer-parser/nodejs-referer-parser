import { RefererParams } from './types';

export const buildLookup = (
  referers: Record<string, RefererParams>
): ((refererHost: string, refererPath: string, includePath: boolean) => RefererParams | null) => {
  const lookup = (refererHost: string, refererPath: string, includePath: boolean) => {
    const withPath = (host: string, p: string) => referers[host + p];
    const justHost = (host: string) => referers[host];
    const deepPath = (host: string, splitted: string[]) =>
      splitted.length > 1 ? referers[`${host}/${splitted[1]}`] : null;

    const look: () => RefererParams = () => (includePath ? withPath(refererHost, refererPath) : justHost(refererHost));
    const deep: () => RefererParams | null = () => (includePath ? deepPath(refererHost, refererPath.split('/')) : null);
    const sliced: () => RefererParams | null = () => {
      const idx = refererHost.indexOf('.');
      if (idx === -1) return null;

      const slicedHost = refererHost.slice(idx + 1);
      return lookup(slicedHost, refererPath, includePath);
    };
    return look() || deep() || sliced();
  };

  return lookup;
};

export const lookupReferer = (
  referers: Record<string, RefererParams>,
  refererHost: string,
  refererPath: string,
  includePath: boolean
): RefererParams | null => buildLookup(referers)(refererHost, refererPath, includePath);
