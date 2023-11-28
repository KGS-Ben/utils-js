import { Passport, Authenticator } from 'passport';
import { applyAccessTokenValidation, applySerializeUser, applyUserLogin } from './strategies';
import {
    GetUserByUsername,
    GetUserDataWithAuth,
    SendTwoFactorEmail,
    ValidateTwoFactorCode,
} from './types/strategies';

export class PassportDecorator {
    passportInstance: Authenticator;

    constructor() {
        //@ts-expect-error
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
     * @param authenticateUser Function to authenticate a user
     * @param validateTwoFactor Function to validate a 2FA code
     * @param sendTwoFactorEmail Function to send a 2FA email
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
     * @param accessTokenSecret Access Token Secret to validate with
     * @param getUser Function to retrieve a user's access token data
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
     * Get the decorated passport instance.
     *
     * @returns {Authenticator} The decorated passport instance
     */
    getPassport(): Authenticator {
        return this.passportInstance;
    }
}
