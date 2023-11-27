import { Passport, Authenticator } from 'passport';
import { applyAccessTokenValidation, applySerializeUser, applyUserLogin } from './strategies';
import { GetUserByUsername, GetUserDataWithAuth, SendTwoFactorEmail, ValidateTwoFactorCode } from './types/strategies';

export class PassportDecorator{
    passportInstance: Authenticator;
    
    constructor() {
        //@ts-expect-error
        this.passportInstance = new Passport();
    }
    
    addSerializeUser() : PassportDecorator{
        applySerializeUser(this.passportInstance);
        return this;
    }
    
    addUserLogin(authenticateUser: GetUserDataWithAuth, validateTwoFactor: ValidateTwoFactorCode, sendTwoFactorEmail: SendTwoFactorEmail) : PassportDecorator{
        applyUserLogin(this.passportInstance, authenticateUser, validateTwoFactor, sendTwoFactorEmail);
        return this;
    }

    addAccessTokenValidation(accessTokenSecret : string, getUser : GetUserByUsername) : PassportDecorator{
        applyAccessTokenValidation(this.passportInstance, accessTokenSecret, getUser);
        return this;
    }

    getPassport() : Authenticator{
        return this.passportInstance;
    }
};
