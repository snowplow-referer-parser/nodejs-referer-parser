import querystring from 'querystring';
import url from 'url';
import { lookupReferer } from './lookup';
import { loadDefault } from './referers';
import { ParsedRefererObject, RefererParams } from './types';

export * from './types';

const REFERERS = loadDefault();

function Referer(
  this: ParsedRefererObject,
  refererURL: string,
  currentURL?: string,
  referers?: Record<string, unknown>
): void {
  this.known = false;
  this.referer = null;
  this.medium = 'unknown';
  this.searchParameter = null;
  this.searchTerm = null;
  this.referers = referers || REFERERS;

  const refererURI = url.parse(refererURL);
  const refererHost = refererURI.hostname;
  this.known = ['http:', 'https:'].includes(refererURI.protocol || '');
  this.uri = refererURI;

  if (!this.known) return;

  if (currentURL) {
    const currentURI = url.parse(currentURL);
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
    if (!referer.params) return;

    const pqs = querystring.parse(refererURI.query || '');

    const result = referer.params
      .map((d: string) => [d, pqs[d]])
      .filter(([, v]) => !!v)
      .reverse()[0];

    this.searchParameter = (result && result[0]) || null;
    this.searchTerm = (result && result[1]) || null;
  }
}

Referer.prototype.lookupReferer = function lookup(
  refererHost: string | null,
  refererPath: string | null,
  include_path: boolean
): RefererParams | null {
  return lookupReferer(this.referers, refererHost || '', refererPath || '', include_path);
};

export default Referer;
