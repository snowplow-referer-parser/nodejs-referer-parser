import { RefererParams } from './types';
export declare const buildLookup: (referers: Record<string, RefererParams>) => (refererHost: string, refererPath: string, includePath: boolean) => RefererParams | null;
export declare const lookupReferer: (referers: Record<string, RefererParams>, refererHost: string, refererPath: string, includePath: boolean) => RefererParams | null;
