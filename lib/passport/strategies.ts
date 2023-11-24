const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const userAuth = require('../api/userAuth.js');
const { getUser, generateAndSend2FAToken } = require('../api/usersApi.js');
require('dotenv').config();
const twofactor = require('node-2fa');

/**
 * Process the logged in user and retrieve necessary data.
 */
passport.serializeUser(function (user, done) {
    done(null, user);
});

/**
 * Action to perform when validating a generic JWT's payload.
 * Expects header as: Authorization: "JWT <TOKEN_HERE>"
 */
passport.use(
    'jwt',
    new JwtStrategy(
        {
            secretOrKey: process.env.ACCESS_TOKEN_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        },
        async (payload, done) => {
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
    )
);

/**
 * Validates an admin's access token
 * Expects header as: Authorization: "JWT <TOKEN_HERE>"
 */
passport.use(
    'isAdmin',
    new JwtStrategy(
        {
            secretOrKey: process.env.ACCESS_TOKEN_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        },
        async (payload, done) => {
            try {
                let user = await getUser(payload.username);

                if (!user) {
                    throw Error('Failed to authenticate');
                }

                if (!user.roles.includes('Admin')) {
                    done(Error('Unauthorized Access'), false);
                }
                done(null, user);
            } catch (error) {
                done(error, false);
            }
        }
    )
);

/**
 * Validates a manager's access token
 * Expects header as: Authorization: "JWT <TOKEN_HERE>"
 */
passport.use(
    'isManager',
    new JwtStrategy(
        {
            secretOrKey: process.env.ACCESS_TOKEN_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        },
        async (payload, done) => {
            try {
                let user = await getUser(payload.username);

                if (!user) {
                    throw Error('Failed to authenticate');
                }
                // allow admins to have manager access
                if (!user.roles.includes('Manager') && !user.roles.includes('Admin')) {
                    done(Error('Unauthorized Access'), false);
                }
                done(null, user);
            } catch (error) {
                done(error, false);
            }
        }
    )
);

/**
 * Action to perform user logs in.
 * username and password should be in body as form-data.
 */
passport.use(
    new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
        try {
            let user = await userAuth.authUser({
                username,
                password,
            });

            // if user not found in database
            if (!user || Object.keys(user).length === 0) {
                req.authStatus = 401;
                return done(Error('User not found'), false);
            }

            if (process.env.NODE_ENV.toLowerCase() === 'dev') {
                return done(null, user);
            }

            // ensure 2fa token is valid timewise
            let date = new Date();
            if (user.tokenExpire > date && req.body.twoFACode) {
                let comparison = await twofactor.verifyToken(user.secret2FA, req.body.twoFACode);
                if (comparison != null) {
                    req.authStatus = 200;
                    return done(null, user);
                }
            }

            // send new 2FA token
            await generateAndSend2FAToken(user);
            req.authStatus = 203;
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);

module.exports = passport;
