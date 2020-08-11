/* eslint-disable no-bitwise */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-loop-func */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
import querystring from 'querystring';
import url from 'url';
import { lookupReferer } from './lookup';
import { REFERERS } from './referers';
import { ParsedRefererObject, RefererParams } from './types';

function Referer(
  this: ParsedRefererObject,
  referer_url: string,
  current_url?: string,
  referers?: Record<string, unknown>
): void {
  this.known = false;
  this.referer = null;
  this.medium = 'unknown';
  this.searchParameter = null;
  this.searchTerm = null;
  this.referers = referers || REFERERS;

  const ref_uri = url.parse(referer_url);
  const ref_host = ref_uri.hostname;
  this.known = Boolean(~['http:', 'https:'].indexOf(ref_uri.protocol || ''));
  this.uri = ref_uri;

  if (!this.known) return;

  if (current_url) {
    const curr_uri = url.parse(current_url);
    const curr_host = curr_uri.hostname;

    if (curr_host === ref_host) {
      this.medium = 'internal';
      return;
    }
  }

  let referer = this._lookup_referer(ref_host, ref_uri.pathname, true);
  if (!referer) {
    referer = this._lookup_referer(ref_host, ref_uri.pathname, false);
    if (!referer) {
      this.medium = 'unknown';
      return;
    }
  }

  this.referer = referer.name;
  this.medium = referer.medium;

  if (referer.medium === 'search') {
    if (!referer.params) return;

    const pqs = querystring.parse(ref_uri.query || '');

    const result = referer.params
      .map((d: string) => [d, pqs[d]])
      .filter(([, v]) => !!v)
      .reverse()[0];

    this.searchParameter = (result && result[0]) || null;
    this.searchTerm = (result && result[1]) || null;
  }
}

Referer.prototype._lookup_referer = function (
  ref_host: string | null,
  ref_path: string | null,
  include_path: boolean
): RefererParams | null {
  return lookupReferer(this.referers, ref_host || '', ref_path || '', include_path);
};

export default Referer;
