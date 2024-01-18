import { Authenticator } from 'passport';
import { GetUserByUsername, GetUserDataWithAuth, SendTwoFactorEmail, ValidateTwoFactorCode } from './types/strategies';
export * from './types/strategies';
/**
 * @classdesc Create and customize a passport instance
 * @example <caption>Create a decorated passport instance</caption>
 * const { PassportDecorator } = require('utils')
 * const passport = new PassportDecorator()
 *   .addSerializeUser()
 *   .addAccessTokenValidation(secret, getUser)
 *   .addUserValidation(authenticateUser, validateTwoFactor, sendTwoFactorEmail)
 *   .getPassport();
 */
export declare class PassportDecorator {
    passportInstance: Authenticator;
    constructor();
    /**
     * Add the user object to the user's requests.
     *
     * @returns {PassportDecorator} this PassportDecorator
     */
    addSerializeUser(): PassportDecorator;
    /**
     * Add a strategy to login a user and check/send 2FA codes.
     *
     * @param {GetUserDataWithAuth} authenticateUser Function to authenticate a user
     * @param {ValidateTwoFactorCode} validateTwoFactor Function to validate a 2FA code
     * @param {SendTwoFactorEmail} sendTwoFactorEmail Function to send a 2FA email
     * @returns {PassportDecorator} this PassportDecorator
     */
    addUserLogin(authenticateUser: GetUserDataWithAuth, validateTwoFactor: ValidateTwoFactorCode, sendTwoFactorEmail: SendTwoFactorEmail): PassportDecorator;
    /**
     * Add a strategy that validates a request's access token.
     * Expects header as: Authorization: "JWT <TOKEN_HERE>"
     *
     * @param {string} accessTokenSecret Access Token Secret to validate with
     * @param {GetUserByUsername} getUser Function to retrieve a user's access token data
     * @returns {PassportDecorator} this PassportDecorator
     */
    addAccessTokenValidation(accessTokenSecret: string, getUser: GetUserByUsername): PassportDecorator;
    /**
     * Add a strategy that validates a request's bearer token.
     * Expects header as: Authorization: "Bearer <TOKEN_HERE>"
     *
     * @param {string} validBearerToken Bearer Token Secret
     * @returns {PassportDecorator} this PassportDecorator
     */
    addBearerTokenValidation(validBearerToken: string): this;
    /**
     * Get the decorated passport instance.
     *
     * @returns {Authenticator} The decorated passport instance
     */
    getPassport(): Authenticator;
}
