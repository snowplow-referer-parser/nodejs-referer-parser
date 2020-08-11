import querystring from 'querystring';
import url from 'url';
import { buildLookup } from './lookup';
import { REFERERS } from './referers';
import { emptyReferer, ParsedReferer, RefererParams } from './types';

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
