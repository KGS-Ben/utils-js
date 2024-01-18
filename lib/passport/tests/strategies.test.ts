import {
    GetUserByUsername,
    GetUserDataWithAuth,
    SendTwoFactorEmail,
    TwoFactorRequest,
    User,
    ValidateTwoFactorCode,
} from '../types/strategies';
import { verifyAccessToken, verifyBearerToken, verifyUserLogin } from '../strategies';
import { HttpStatusCode } from 'axios';

const testUser: User = {
    username: 'bob',
    password: '1234',
    email: 'bob@testing.com',
    secret2FA: 'secretTwoFactor',
    tokenExpire: new Date(new Date().setTime(new Date().getTime() + 100000)),
};

describe('verifyAccessToken', () => {
    const getValidUserNoAuth: GetUserByUsername = jest.fn(() => {
        return Promise.resolve(testUser);
    });
    //@ts-ignore
    const getInvalidUserNoAuthEmptyObj: GetUserByUsername = jest.fn(() => {
        return Promise.resolve({});
    });
    //@ts-ignore
    const getInvalidUserNoAuthNullReturn: GetUserByUsername = jest.fn(() => {
        return Promise.resolve(null);
    });

    it('should allow a valid user', async () => {
        const payload: any = {
            username: 'bob',
            password: '1234',
        };
        const doneCb = jest.fn((error, data) => {
            expect(error).toEqual(null);
            expect(data).toEqual(testUser);
        });

        await verifyAccessToken(payload, doneCb)(getValidUserNoAuth);
        expect(doneCb).toHaveBeenCalled();
    });

    it('should not allow an invalid user', async () => {
        const payload: any = {
            username: 'InvalidUser',
            password: '1234',
        };
        const doneCb = jest.fn((error, data) => {
            expect(error).toBeTruthy();
            expect(data).toEqual(false);
        });

        await verifyAccessToken(payload, doneCb)(getInvalidUserNoAuthEmptyObj);
        expect(doneCb).toHaveBeenCalled();
    });

    it('should not allow an invalid user', async () => {
        const payload: any = {
            username: 'InvalidUser',
            password: '1234',
        };
        const doneCb = jest.fn();

        await verifyAccessToken(payload, doneCb)(getInvalidUserNoAuthNullReturn);
        expect(doneCb).not.toHaveBeenCalled();
    });
});

describe('verifyUserLogin', () => {
    const expiredUser: User = {
        username: 'bob',
        password: '1234',
        email: 'bob@testing.com',
        secret2FA: 'secretTwoFactor',
        tokenExpire: new Date(new Date().setTime(new Date().getTime() - 10000)),
    };
    const authenticateValidUser: GetUserDataWithAuth = jest.fn(async () => testUser);
    const authenticateExpiredUser: GetUserDataWithAuth = jest.fn(async () => expiredUser);
    //@ts-ignore
    const returnEmptyUser: GetUserDataWithAuth = jest.fn(async () => ({}));
    //@ts-ignore
    const returnNullUser: GetUserDataWithAuth = jest.fn(async () => null);

    const validCode: ValidateTwoFactorCode = jest.fn(async () => Promise.resolve(true));
    const invalidCode: ValidateTwoFactorCode = jest.fn(async () => Promise.resolve(false));
    const sendTwoFactorEmail: SendTwoFactorEmail = jest.fn(async () => Promise.resolve());

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should error if user credentials is invalid', async () => {
        const req: TwoFactorRequest = {
            authStatus: undefined,
            body: {
                twoFACode: 'code',
            },
        };
        const doneCb = jest.fn((error, data) => {
            expect(req.authStatus).toEqual(HttpStatusCode.Unauthorized);
            expect(error).toBeTruthy();
            expect(data).toBeFalsy();
        });
        await verifyUserLogin(
            req,
            testUser.username,
            testUser.password,
            doneCb
        )(returnEmptyUser, validCode, sendTwoFactorEmail);
        await verifyUserLogin(
            req,
            'InvalidUser',
            'password',
            doneCb
        )(returnNullUser, validCode, sendTwoFactorEmail);
        expect(doneCb).toHaveBeenCalledTimes(2);
    });

    it('should send new 2FA code if previous code expired', async () => {
        const req: TwoFactorRequest = {
            authStatus: undefined,
            body: {
                twoFACode: 'code',
            },
        };
        const doneCb = jest.fn((error, data) => {
            expect(req.authStatus).toEqual(HttpStatusCode.NonAuthoritativeInformation);
            expect(error).toEqual(null);
            expect(data).toBe(expiredUser);
        });

        await verifyUserLogin(
            req,
            'ValidUser',
            'password',
            doneCb
        )(authenticateExpiredUser, invalidCode, sendTwoFactorEmail);
        expect(doneCb).toHaveBeenCalled();
        expect(sendTwoFactorEmail).toHaveBeenCalledTimes(1);
    });

    it('should send new 2FA code if invalid code provided', async () => {
        const req: TwoFactorRequest = {
            authStatus: undefined,
            body: {
                twoFACode: 'code',
            },
        };
        const doneCb = jest.fn((error, data) => {
            expect(req.authStatus).toEqual(HttpStatusCode.NonAuthoritativeInformation);
            expect(error).toEqual(null);
            expect(data).toBe(testUser);
        });

        await verifyUserLogin(
            req,
            'ValidUser',
            'password',
            doneCb
        )(authenticateValidUser, invalidCode, sendTwoFactorEmail);
        expect(invalidCode).toHaveBeenCalled();
        expect(sendTwoFactorEmail).toHaveBeenCalledTimes(1);
        expect(doneCb).toHaveBeenCalled();
    });

    it('should handle correct 2FA code entered', async () => {
        const req: TwoFactorRequest = {
            authStatus: undefined,
            body: {
                twoFACode: 'code',
            },
        };

        const doneCb = jest.fn((error, data) => {
            expect(req.authStatus).toEqual(HttpStatusCode.Ok);
            expect(error).toBeFalsy();
            expect(data).toEqual(testUser);
        });

        await verifyUserLogin(
            req,
            'ValidUser',
            'password',
            doneCb
        )(authenticateValidUser, validCode, sendTwoFactorEmail);
        expect(validCode).toHaveBeenCalled();
        expect(sendTwoFactorEmail).not.toHaveBeenCalled();
        expect(doneCb).toHaveBeenCalled();
    });
});

describe('verifyBearerToken', () => {
    const VALID_TOKEN = 'VALID_TOKEN';
    it('should not validate an invalid token', done => {
        verifyBearerToken('invalidToken', VALID_TOKEN, error => {
            expect(error).toBeTruthy();
            done();
        });
    });

    it('should validate a valid token', done => {
        verifyBearerToken(VALID_TOKEN, VALID_TOKEN, error => {
            expect(error).toBeFalsy();
            done();
        });
    });
});
