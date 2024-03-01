"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyBearerToken = exports.applyUserLogin = exports.applyAccessTokenValidation = exports.verifyBearerToken = exports.applySerializeUser = exports.verifyAccessToken = exports.verifyUserLogin = void 0;
const passport_local_1 = require("passport-local");
const passport_http_bearer_1 = require("passport-http-bearer");
const passport_jwt_1 = require("passport-jwt");
const axios_1 = require("axios");
/**
 * Verify a user's login and apply two factor authentication.
 *
 * @param req A request made by a user to login
 * @param username User's username
 * @param password User's password
 * @param done Passport VerifiedCallback, called when function is completed
 * @returns {VerifyUserLogin} Function that validates a user during login
 */
function verifyUserLogin(req, username, password, done) {
    return async (authenticateUser, validateTwoFactor, sendTwoFactorEmail) => {
        try {
            let user = await authenticateUser(username, password);
            if (!user || Object.keys(user).length === 0) {
                req.authStatus = axios_1.HttpStatusCode.Unauthorized;
                return done(Error('User not found'), false);
            }
            if (process?.env?.NODE_ENV?.toLowerCase() === 'dev') {
                return done(null, user);
            }
            // Validate token
            let date = new Date();
            if (user.tokenExpire > date && req.body.twoFACode) {
                const isValid = await validateTwoFactor(user.secret2FA, req.body.twoFACode);
                if (isValid) {
                    req.authStatus = axios_1.HttpStatusCode.Ok;
                    return done(null, user);
                }
            }
            // send new 2FA token
            await sendTwoFactorEmail(user);
            req.authStatus = axios_1.HttpStatusCode.NonAuthoritativeInformation;
            return done(null, user);
        }
        catch (error) {
            return done(error, false);
        }
    };
}
exports.verifyUserLogin = verifyUserLogin;
/**
 * Verify a user's access token.
 *
 * @param payload Parsed data from JwtStrategy
 * @param done Passport callback called upon completion
 * @returns {VerifyAccessToken} Function that validates a request's access token
 */
function verifyAccessToken(payload, done) {
    return async (getUser) => {
        try {
            let user = await getUser(payload.username);
            if (!user) {
                return;
            }
            if (user.password !== payload.password) {
                throw Error('Failed to authenticate');
            }
            done(null, user);
        }
        catch (error) {
            done(error, false);
        }
    };
}
exports.verifyAccessToken = verifyAccessToken;
/**
 * Registers a function to serialize user objects into the session.
 */
function applySerializeUser(passport) {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
}
exports.applySerializeUser = applySerializeUser;
/**
 * Authenticate a Bearer token.
 *
 * @param {String} providedToken user provided token
 * @param {String} validToken expected auth token
 * @param {VerifiedCallback} done Callback function upon authenticated
 */
function verifyBearerToken(providedToken, validToken, done) {
    if (providedToken === validToken) {
        return done(null, false);
    }
    return done('Unauthorized access');
}
exports.verifyBearerToken = verifyBearerToken;
/**
 * Add a strategy that validates a request's access token.
 * Expects header as: Authorization: "JWT <TOKEN_HERE>"
 *
 * @param passport A passport instance to apply a strategy to
 * @param accessTokenSecret Access Token Secret to validate with
 * @param getUser Function to retrieve a user's access token data
 */
function applyAccessTokenValidation(passport, accessTokenSecret, getUser) {
    passport.use('jwt', new passport_jwt_1.Strategy({
        secretOrKey: accessTokenSecret,
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    }, (payload, done) => verifyAccessToken(payload, done)(getUser)));
}
exports.applyAccessTokenValidation = applyAccessTokenValidation;
/**
 * Add a strategy to login a user and check/send 2FA codes.
 *
 * @param passport A passport instance to apply a strategy to
 * @param authenticateUser Function to authenticate a user
 * @param validateTwoFactor Function to validate a 2FA code
 * @param sendTwoFactorEmail Function to send a 2FA email
 */
function applyUserLogin(passport, authenticateUser, validateTwoFactor, sendTwoFactorEmail) {
    passport.use(new passport_local_1.Strategy({ passReqToCallback: true }, (req, username, password, done) => {
        return verifyUserLogin(req, username, password, done)(authenticateUser, validateTwoFactor, sendTwoFactorEmail);
    }));
}
exports.applyUserLogin = applyUserLogin;
/**
 * Adds a bearer token strategy.
 * Expects header: Authorization: 'Bearer <token>'
 *
 * @param passport A passport instance
 * @param expectedToken The valid bearer token
 */
function applyBearerToken(passport, expectedToken) {
    passport.use(new passport_http_bearer_1.Strategy((token, done) => {
        return verifyBearerToken(token, expectedToken, done);
    }));
}
exports.applyBearerToken = applyBearerToken;
//# sourceMappingURL=strategies.js.map