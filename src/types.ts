import url from 'url';

export interface RefererSourceParameters {
  domains: string[];
  parameters?: string[];
}

export type RefererSourceEntry = Record<string, RefererSourceParameters>;
export type RefererSource = Record<string, RefererSourceEntry>;

export interface RefererParams {
  name: string;
  medium: string;
  params: string[];
}

export interface SearchParameters {
  searchParameter: string | string[] | null;
  searchTerm: string | string[] | null;
}

export type ParsedReferer = {
  uri: url.UrlWithStringQuery | null;
  known: boolean;
  referer: string | null;
  medium: string | null;
} & SearchParameters;

export type ParsedRefererObject = {
  referers: Record<string, unknown>;
  lookupReferer: (refererHost: string | null, refererPath: string | null, includePath: boolean) => RefererParams | null;
} & ParsedReferer;

export const emptyReferer = {
  uri: null,
  known: false,
  referer: null,
  medium: null,
  searchParameter: null,
  searchTerm: null,
};
