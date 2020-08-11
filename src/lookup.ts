import { RefererParams } from './types';

export const buildLookup = (
  referers: Record<string, RefererParams>
): ((refererHost: string, ref_path: string, include_path: boolean) => RefererParams | null) => {
  const lookup = (refererHost: string, ref_path: string, include_path: boolean) => {
    const withPath = (host: string, p: string) => referers[host + p];
    const justHost = (host: string) => referers[host];
    const deepPath = (host: string, splitted: string[]) =>
      splitted.length > 1 ? referers[`${host}/${splitted[1]}`] : null;

    const look: () => RefererParams = () => (include_path ? withPath(refererHost, ref_path) : justHost(refererHost));
    const deep: () => RefererParams | null = () => (include_path ? deepPath(refererHost, ref_path.split('/')) : null);
    const sliced: () => RefererParams | null = () => {
      try {
        const idx = refererHost.indexOf('.');
        if (idx === -1) return null;

        const slicedHost = refererHost.slice(idx + 1);
        return lookup(slicedHost, ref_path, include_path);
      } catch (e) {
        return null;
      }
    };
    return look() || deep() || sliced();
  };

  return lookup;
};

export const lookupReferer = (
  referers: Record<string, RefererParams>,
  refererHost: string,
  ref_path: string,
  include_path: boolean
): RefererParams | null => buildLookup(referers)(refererHost, ref_path, include_path);
