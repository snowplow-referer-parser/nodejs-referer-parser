import querystring from 'querystring';
import url from 'url';
import { buildLookup } from './lookup';
import { REFERERS } from './referers';
import { emptyReferer, ParsedReferer, RefererParams } from './types';

type Parse = (
  referers?: Record<string, RefererParams>
) => (currentUrl?: string | null) => (refererURL: string) => ParsedReferer;

const parse: Parse = (referers = REFERERS) => {
  const lookupReferer = buildLookup(referers);
  return (currentUrl: string | null = null) => {
    const internal = url.parse(currentUrl || '').hostname;

    return (refererURL: string): ParsedReferer => {
      const refererURI = url.parse(refererURL);
      const refererHost = refererURI.hostname || '';

      const isInternal = currentUrl && refererHost === internal;

      const known = ['http:', 'https:'].includes(refererURI.protocol || '');
      if (!known || isInternal)
        return {
          ...emptyReferer,
          uri: refererURI,
          known,
          medium: isInternal ? 'internal' : 'unknown',
        };

      const referer =
        lookupReferer(refererHost, refererURI.pathname || '', true) ||
        lookupReferer(refererHost, refererURI.pathname || '', false);

      if (!referer)
        return {
          ...emptyReferer,
          uri: refererURI,
          known,
          medium: 'unknown',
        };

      if (referer.medium === 'search' && referer.params) {
        const pqs = querystring.parse(refererURI.query || '');
        const result = referer.params
          .map((d: string) => [d, pqs[d]])
          .filter(([, v]) => !!v)
          .reverse()[0];

        return {
          uri: refererURI,
          known,
          referer: referer.name,
          medium: referer.medium,
          searchParameter: (result && result[0]) || null,
          searchTerm: (result && result[1]) || null,
        };
      }
      return {
        ...emptyReferer,
        uri: refererURI,
        known,
        referer: referer.name,
        medium: referer.medium,
      };
    };
  };
};

export default parse;
