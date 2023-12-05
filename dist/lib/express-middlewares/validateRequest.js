"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateBody = void 0;
/**
 * Express module for inbound request validations
 */
const axios_1 = require("axios");
/**
 * Middleware validation on request.body parameters.
 *
 * @param bodyKeys List of keys that should appear in request.body
 */
function validateBody(bodyKeys) {
    return function (req, res, next) {
        try {
            if (!req.body) {
                throw Error('Missing body in request');
            }
            for (let key of bodyKeys) {
                if (req.body[key] === undefined) {
                    throw Error(`Missing ${key} from request body`);
                }
            }
            return next();
        }
        catch (error) {
            res.status(axios_1.HttpStatusCode.UnprocessableEntity).send(error.message);
        }
    };
}
exports.validateBody = validateBody;
/**
 * Middleware to validate request.query parameters.
 *
 * @param queryKeys Keys that should appear in request.query
 */
function validateQuery(queryKeys) {
    return function (req, res, next) {
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
        }
        catch (error) {
            res.status(axios_1.HttpStatusCode.UnprocessableEntity).send(error.message);
        }
    };
}
exports.validateQuery = validateQuery;
//# sourceMappingURL=validateRequest.js.map