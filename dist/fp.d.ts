import { ParsedReferer } from './types';
export * from './types';
declare function parser(referers?: Record<string, unknown>): (refererURL: string, currentUrl?: string | null) => ParsedReferer;
export default parser;
