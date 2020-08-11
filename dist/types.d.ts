/// <reference types="node" />
import url from 'url';
export interface RefererSourceParameters {
    domains: string[];
    parameters?: string[];
}
export declare type RefererSourceEntry = Record<string, RefererSourceParameters>;
export declare type RefererSource = Record<string, RefererSourceEntry>;
export interface RefererParams {
    name: string;
    medium: string;
    params: string[];
}
export interface SearchParameters {
    searchParameter: string | string[] | null;
    searchTerm: string | string[] | null;
}
export declare type ParsedReferer = {
    uri: url.UrlWithStringQuery | null;
    known: boolean;
    referer: string | null;
    medium: string | null;
} & SearchParameters;
export declare type ParsedRefererObject = {
    referers: Record<string, unknown>;
    lookupReferer: (refererHost: string | null, refererPath: string | null, includePath: boolean) => RefererParams | null;
} & ParsedReferer;
export declare const emptyReferer: {
    uri: null;
    known: boolean;
    referer: null;
    medium: null;
    searchParameter: null;
    searchTerm: null;
};
