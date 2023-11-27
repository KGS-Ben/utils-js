import { GetUserByUsername, GetUserDataWithAuth, TwoFactorRequest, ValidateTwoFactorCode, SendTwoFactorEmail, VerifyUserLogin, VerifyAccessToken } from './types/strategies';
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
 */
export function verifyUserLogin (req : TwoFactorRequest, username : string, password : string, done : VerifiedCallback) : VerifyUserLogin{
    return async (authenticateUser : GetUserDataWithAuth, validateTwoFactor : ValidateTwoFactorCode, sendTwoFactorEmail : SendTwoFactorEmail) : Promise<void> => {
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
    }
}

/**
 * Verify a user's access token.
 *
 * @param payload Parsed data from JwtStrategy
 * @param done Passport callback called upon completion
 */
export function verifyAccessToken(payload : any, done : VerifiedCallback) : VerifyAccessToken{
    return async (getUser : GetUserByUsername) : Promise<void>  => {
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
    }
}

/**
 * Registers a function to serialize user objects into the session.
 */
export function applySerializeUser(passport : Authenticator) {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
}

/**
 * Adds action to validate an access token.
 * Expects header as: Authorization: "JWT <TOKEN_HERE>"
 */
export function applyAccessTokenValidation(passport : Authenticator, accessTokenSecret : string, getUser : GetUserByUsername) {
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
 * Action to perform user logs in.
 * username and password should be in body as form-data.
 */
export function applyUserLogin(passport : Authenticator, authenticateUser : GetUserDataWithAuth, validateTwoFactor : ValidateTwoFactorCode, sendTwoFactorEmail : SendTwoFactorEmail) {
    passport.use(
        new LocalStrategy({ passReqToCallback: true },
        (req: TwoFactorRequest, username: string, password: string, done: VerifiedCallback) => { 
            return verifyUserLogin(req, username, password, done)(authenticateUser, validateTwoFactor, sendTwoFactorEmail)
        })
    );
}
