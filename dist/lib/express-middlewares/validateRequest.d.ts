import { ExpressMiddleWare } from './types/validateRequests';
/**
 * Middleware validation on request.body parameters.
 *
 * @param bodyKeys List of keys that should appear in request.body
 */
export declare function validateBody(bodyKeys: Array<string>): ExpressMiddleWare;
/**
 * Middleware to validate request.query parameters.
 *
 * @param queryKeys Keys that should appear in request.query
 */
export declare function validateQuery(queryKeys: Array<string>): ExpressMiddleWare;
