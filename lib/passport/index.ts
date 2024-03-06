import { Passport, Authenticator } from 'passport';
import {
    applyAccessTokenValidation,
    applyBearerToken,
    applySerializeUser,
    applyUserLogin,
} from './strategies';
import {
    GetUserByUsername,
    GetUserDataWithAuth,
    SendTwoFactorEmail,
    ValidateTwoFactorCode,
} from './types/strategies';

export * from './types/strategies';

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
export class PassportDecorator {
    passportInstance: Authenticator;

    constructor() {
        //@ts-ignore
        this.passportInstance = new Passport();
    }

    /**
     * Add the user object to the user's requests.
     *
     * @returns {PassportDecorator} this PassportDecorator
     */
    addSerializeUser(): PassportDecorator {
        applySerializeUser(this.passportInstance);
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
    addUserLogin(
        authenticateUser: GetUserDataWithAuth,
        validateTwoFactor: ValidateTwoFactorCode,
        sendTwoFactorEmail: SendTwoFactorEmail
    ): PassportDecorator {
        applyUserLogin(
            this.passportInstance,
            authenticateUser,
            validateTwoFactor,
            sendTwoFactorEmail
        );
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
    addAccessTokenValidation(
        accessTokenSecret: string,
        getUser: GetUserByUsername
    ): PassportDecorator {
        applyAccessTokenValidation(this.passportInstance, accessTokenSecret, getUser);
        return this;
    }

    /**
     * Add a strategy that validates a request's bearer token.
     * Expects header as: Authorization: "Bearer <TOKEN_HERE>"
     *
     * @param {string} validBearerToken Bearer Token Secret
     * @returns {PassportDecorator} this PassportDecorator
     */
    addBearerTokenValidation(validBearerToken: string) {
        applyBearerToken(this.passportInstance, validBearerToken);
        return this;
    }

    /**
     * Get the decorated passport instance.
     *
     * @returns {Authenticator} The decorated passport instance
     */
    getPassport(): Authenticator {
        return this.passportInstance;
    }
}
