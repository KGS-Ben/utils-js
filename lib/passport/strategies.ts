import {
    GetUserByUsername,
    GetUserDataWithAuth,
    TwoFactorRequest,
    ValidateTwoFactorCode,
    SendTwoFactorEmail,
    VerifyUserLogin,
    VerifyAccessToken,
} from './types/strategies';
import { Authenticator } from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { HttpStatusCode } from 'axios';

/**
 * Verify a user's login and apply two factor authentication.
 *
 * @param req A request made by a user to login
 * @param username User's username
 * @param password User's password
 * @param done Passport VerifiedCallback, called when function is completed
 * @returns {VerifyUserLogin} Function that validates a user during login
 */
export function verifyUserLogin(
    req: TwoFactorRequest,
    username: string,
    password: string,
    done: VerifiedCallback
): VerifyUserLogin {
    return async (
        authenticateUser: GetUserDataWithAuth,
        validateTwoFactor: ValidateTwoFactorCode,
        sendTwoFactorEmail: SendTwoFactorEmail
    ): Promise<void> => {
        try {
            let user = await authenticateUser(username, password);

            if (!user || Object.keys(user).length === 0) {
                req.authStatus = HttpStatusCode.Unauthorized;
                return done(Error('User not found'), false);
            }

            if (process.env.NODE_ENV.toLowerCase() === 'dev') {
                return done(null, user);
            }

            // Validate token
            let date = new Date();
            if (user.tokenExpire > date && req.body.twoFACode) {
                const isValid = await validateTwoFactor(user.secret2FA, req.body.twoFACode);
                if (isValid) {
                    req.authStatus = HttpStatusCode.Ok;
                    return done(null, user);
                }
            }

            // send new 2FA token
            await sendTwoFactorEmail(user);
            req.authStatus = HttpStatusCode.NonAuthoritativeInformation;
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    };
}

/**
 * Verify a user's access token.
 *
 * @param payload Parsed data from JwtStrategy
 * @param done Passport callback called upon completion
 * @returns {VerifyAccessToken} Function that validates a request's access token
 */
export function verifyAccessToken(payload: any, done: VerifiedCallback): VerifyAccessToken {
    return async (getUser: GetUserByUsername): Promise<void> => {
        try {
            let user = await getUser(payload.username);

            if (!user) {
                return null;
            }

            if (user.password !== payload.password) {
                throw Error('Failed to authenticate');
            }

            done(null, user);
        } catch (error) {
            done(error, false);
        }
    };
}

/**
 * Registers a function to serialize user objects into the session.
 */
export function applySerializeUser(passport: Authenticator) {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
}

/**
 * Add a strategy that validates a request's access token.
 * Expects header as: Authorization: "JWT <TOKEN_HERE>"
 *
 * @param passport A passport instance to apply a strategy to
 * @param accessTokenSecret Access Token Secret to validate with
 * @param getUser Function to retrieve a user's access token data
 * @returns {PassportDecorator} this PassportDecorator
 */
export function applyAccessTokenValidation(
    passport: Authenticator,
    accessTokenSecret: string,
    getUser: GetUserByUsername
) {
    passport.use(
        'jwt',
        new JwtStrategy(
            {
                secretOrKey: accessTokenSecret,
                jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
            },
            (payload, done) => verifyAccessToken(payload, done)(getUser)
        )
    );
}


/**
 * Add a strategy to login a user and check/send 2FA codes.
 *
 * @param passport A passport instance to apply a strategy to
 * @param authenticateUser Function to authenticate a user
 * @param validateTwoFactor Function to validate a 2FA code
 * @param sendTwoFactorEmail Function to send a 2FA email
 * @returns {PassportDecorator} this PassportDecorator
 */
export function applyUserLogin(
    passport: Authenticator,
    authenticateUser: GetUserDataWithAuth,
    validateTwoFactor: ValidateTwoFactorCode,
    sendTwoFactorEmail: SendTwoFactorEmail
) {
    passport.use(
        new LocalStrategy(
            { passReqToCallback: true },
            (req: TwoFactorRequest, username: string, password: string, done: VerifiedCallback) => {
                return verifyUserLogin(
                    req,
                    username,
                    password,
                    done
                )(authenticateUser, validateTwoFactor, sendTwoFactorEmail);
            }
        )
    );
}
