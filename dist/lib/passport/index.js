"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportDecorator = void 0;
const passport_1 = require("passport");
const strategies_1 = require("./strategies");
__exportStar(require("./types/strategies"), exports);
/**
 * @classdesc Create and customize a passport instance
 * @example <caption>Create a decorated passport instance</caption>
 * const { PassportDecorator } = require('utils')
 * const passport = new PassportDecorator()
 *   .addSerializeUser()
 *   .addAccessTokenValidation(secret, getUser)
 *   .addUserLogin(authenticateUser, validateTwoFactor, sendTwoFactorEmail)
 *   .getPassport();
 */
class PassportDecorator {
    passportInstance;
    constructor() {
        //@ts-ignore
        this.passportInstance = new passport_1.Passport();
    }
    /**
     * Add the user object to the user's requests.
     *
     * @returns {PassportDecorator} this PassportDecorator
     */
    addSerializeUser() {
        (0, strategies_1.applySerializeUser)(this.passportInstance);
        return this;
    }
    /**
     * Add a strategy to login a user and check/send 2FA codes.
     *
     * @param {GetUserDataWithAuth} authenticateUser Function to authenticate a user
     * @param {ValidateTwoFactorCode} validateTwoFactor Function to validate a 2FA code
     * @param {SendTwoFactorEmail} sendTwoFactorEmail Function to send a 2FA email
     * @returns {PassportDecorator} this PassportDecorator
     */
    addUserLogin(authenticateUser, validateTwoFactor, sendTwoFactorEmail) {
        (0, strategies_1.applyUserLogin)(this.passportInstance, authenticateUser, validateTwoFactor, sendTwoFactorEmail);
        return this;
    }
    /**
     * Add a strategy that validates a request's access token.
     * Expects header as: Authorization: "JWT <TOKEN_HERE>"
     *
     * @param {string} accessTokenSecret Access Token Secret to validate with
     * @param {GetUserByUsername} getUser Function to retrieve a user's access token data
     * @returns {PassportDecorator} this PassportDecorator
     */
    addAccessTokenValidation(accessTokenSecret, getUser) {
        (0, strategies_1.applyAccessTokenValidation)(this.passportInstance, accessTokenSecret, getUser);
        return this;
    }
    /**
     * Add a strategy that validates a request's bearer token.
     * Expects header as: Authorization: "Bearer <TOKEN_HERE>"
     *
     * @param {string} validBearerToken Bearer Token Secret
     * @returns {PassportDecorator} this PassportDecorator
     */
    addBearerTokenValidation(validBearerToken) {
        (0, strategies_1.applyBearerToken)(this.passportInstance, validBearerToken);
        return this;
    }
    /**
     * Get the decorated passport instance.
     *
     * @returns {Authenticator} The decorated passport instance
     */
    getPassport() {
        return this.passportInstance;
    }
}
exports.PassportDecorator = PassportDecorator;
//# sourceMappingURL=index.js.map