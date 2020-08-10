/* eslint-disable no-bitwise */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-loop-func */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import querystring from 'querystring';
import url from 'url';

function loadReferers(source: { [x: string]: any }) {
  const referers_dict = {};

  for (const medium in source) {
    const conf_list = source[medium];

    for (const referer_name in conf_list) {
      const config = conf_list[referer_name];
      let params = null;

      if (config.parameters) {
        params = config.parameters.map(function (p: string) {
          return p.toLowerCase();
        });
      }
      config.domains.forEach(function (domain: string | number) {
        referers_dict[domain] = {
          name: referer_name,
          medium,
        };
        if (params) {
          referers_dict[domain].params = params;
        }
      });
    }
  }
  return referers_dict;
}

const dataFile = fs.readFileSync(path.join(__dirname, '..', 'data', 'referers.yml'));
const REFERERS = loadReferers(yaml.load(dataFile.toString(), { json: true }));

function Referer(this: any, referer_url: string, current_url?: string, referers?: Record<string, unknown>) {
  this.known = false;
  this.referer = null;
  this.medium = 'unknown';
  this.search_parameter = null;
  this.search_term = null;
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

    for (const param in pqs) {
      const val = pqs[param];

      if (referer.params.indexOf(param.toLowerCase()) !== -1) {
        this.search_parameter = param;
        this.search_term = val;
      }
    }
  }
}

Referer.prototype._lookup_referer = function (ref_host: string, ref_path: string, include_path: any) {
  // console.log(ref_host, ref_path, include_path)
  let referer = null;

  if (include_path) referer = this.referers[ref_host + ref_path];
  else referer = this.referers[ref_host];
  if (!referer) {
    if (include_path) {
      const path_parts = ref_path.split('/');
      if (path_parts.length > 1) {
        referer = this.referers[`${ref_host}/${path_parts[1]}`];
      }
    }
  }

  if (!referer) {
    try {
      const idx = ref_host.indexOf('.');
      if (idx === -1) return null;

      const slicedHost = ref_host.slice(idx + 1);
      return this._lookup_referer(slicedHost, ref_path, include_path);
    } catch (e) {
      return null;
    }
  } else return referer;
};

export default Referer;
