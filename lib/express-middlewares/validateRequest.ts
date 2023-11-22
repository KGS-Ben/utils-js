/**
 * Express module for inbound request validations
 */
import { HttpStatusCode } from 'axios';
import { Response, Request, NextFunction } from 'express';

/**
 * Middleware validation on request.body parameters.
 *
 * @param bodyKeys List of keys that should appear in request.body
 */
export function validateBody(bodyKeys: Array<string>): (Request, Response, NextFunction) => void {
    return function (req: Request, res: Response, next: NextFunction): void {
        try {
            if (!req.body) {
                throw Error('Missing body in request');
            }

            for (let key of bodyKeys) {
                if (req.body[key] === undefined) {
                    throw Error(`Missing ${key} from request body`);
                }
            }

            if (next) {
                next();
            }
        } catch (error) {
            res.status(HttpStatusCode.UnprocessableEntity).send(error.message);
        }
    };
}

/**
 * Middleware to validate request.query parameters.
 *
 * @param queryKeys Keys that should appear in request.query
 */
export function validateQuery(queryKeys: Array<string>) {
    return function (req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.query) {
                throw Error('Missing parameters in request');
            }

            for (let key of queryKeys) {
                if (req.query[key] === undefined) {
                    throw Error(`Missing ${key} from request query`);
                }
            }
            next();
        } catch (error) {
            res.status(HttpStatusCode.UnprocessableEntity).send(error.message);
        }
    };
}
