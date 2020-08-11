import { ParsedRefererObject } from './types';
export * from './types';
declare function Referer(this: ParsedRefererObject, refererURL: string, currentURL?: string, referers?: Record<string, unknown>): void;
export default Referer;
