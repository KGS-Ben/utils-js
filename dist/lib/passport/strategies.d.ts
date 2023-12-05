import { GetUserByUsername, GetUserDataWithAuth, TwoFactorRequest, ValidateTwoFactorCode, SendTwoFactorEmail, VerifyUserLogin, VerifyAccessToken } from './types/strategies';
import { Authenticator } from 'passport';
import { VerifiedCallback } from 'passport-jwt';
/**
 * Verify a user's login and apply two factor authentication.
 *
 * @param req A request made by a user to login
 * @param username User's username
 * @param password User's password
 * @param done Passport VerifiedCallback, called when function is completed
 * @returns {VerifyUserLogin} Function that validates a user during login
 */
export declare function verifyUserLogin(req: TwoFactorRequest, username: string, password: string, done: VerifiedCallback): VerifyUserLogin;
/**
 * Verify a user's access token.
 *
 * @param payload Parsed data from JwtStrategy
 * @param done Passport callback called upon completion
 * @returns {VerifyAccessToken} Function that validates a request's access token
 */
export declare function verifyAccessToken(payload: any, done: VerifiedCallback): VerifyAccessToken;
/**
 * Registers a function to serialize user objects into the session.
 */
export declare function applySerializeUser(passport: Authenticator): void;
/**
 * Add a strategy that validates a request's access token.
 * Expects header as: Authorization: "JWT <TOKEN_HERE>"
 *
 * @param passport A passport instance to apply a strategy to
 * @param accessTokenSecret Access Token Secret to validate with
 * @param getUser Function to retrieve a user's access token data
 * @returns {PassportDecorator} this PassportDecorator
 */
export declare function applyAccessTokenValidation(passport: Authenticator, accessTokenSecret: string, getUser: GetUserByUsername): void;
/**
 * Add a strategy to login a user and check/send 2FA codes.
 *
 * @param passport A passport instance to apply a strategy to
 * @param authenticateUser Function to authenticate a user
 * @param validateTwoFactor Function to validate a 2FA code
 * @param sendTwoFactorEmail Function to send a 2FA email
 * @returns {PassportDecorator} this PassportDecorator
 */
export declare function applyUserLogin(passport: Authenticator, authenticateUser: GetUserDataWithAuth, validateTwoFactor: ValidateTwoFactorCode, sendTwoFactorEmail: SendTwoFactorEmail): void;
