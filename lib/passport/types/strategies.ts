export interface TwoFactorRequest extends Partial<Express.Request> {
    authStatus: number | undefined;
    body: {
        twoFACode: string;
    };
}

export interface User {
    username: string;
    password: string;
    email: string;
    secret2FA: string;
    tokenExpire: Date;
}

export type GetUserByUsername = (username: string) => Promise<User>;
export type GetUserDataWithAuth = (username: string, password: string) => Promise<User>;
export type ValidateTwoFactorCode = (secret2FA: string, twoFACode: string) => Promise<boolean>;
export type SendTwoFactorEmail = (user: User) => Promise<void>;
export type VerifyUserLogin = (
    authenticateUser: GetUserDataWithAuth,
    validateTwoFactor: ValidateTwoFactorCode,
    sendTwoFactorEmail: SendTwoFactorEmail
) => Promise<void>;
export type VerifyAccessToken = (getUser: GetUserByUsername) => Promise<void>;
