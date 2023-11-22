//@ts-nocheck

import { HttpStatusCode } from 'axios';
import { validateBody, validateQuery } from '../validateRequest';

describe('validateBody', () => {
    let mockResponse;

    beforeEach(() => {
        mockResponse = {
            status: jest.fn(() => mockResponse),
            send: jest.fn(),
        };
    });

    it('should reject a request if missing body', () => {
        mockResponse = {
            status: jest.fn(code => {
                expect(code).toEqual(HttpStatusCode.UnprocessableEntity);
                return mockResponse;
            }),
            send: jest.fn(),
        };

        const mockRequest = {};
        const nextFn = jest.fn();
        validateBody([])(mockRequest, mockResponse, nextFn);
        expect(nextFn).not.toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should reject a request if missing key in body', () => {
        mockResponse = {
            status: jest.fn(code => {
                expect(code).toEqual(HttpStatusCode.UnprocessableEntity);
                return mockResponse;
            }),
            send: jest.fn(),
        };
        const mockRequest = {
            body: {
                test: 'test',
            },
        };

        const nextFn = jest.fn();
        validateBody(['keyToCheck'])(mockRequest, mockResponse, nextFn);
        expect(nextFn).not.toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should find keys in body', () => {
        const mockRequest = {
            body: {
                keyToCheck1: 'test',
                keyToCheck2: 'test',
            },
        };

        const nextFn = jest.fn();
        validateBody(['keyToCheck1', 'keyToCheck2'])(mockRequest, mockResponse, nextFn);
        expect(nextFn).toHaveBeenCalled();
    });

    it('should not be valid if not all keys exist in body', () => {
        const mockRequest = {
            body: {
                keyToCheck1: 'test',
            },
        };

        const nextFn = jest.fn();
        validateBody(['keyToCheck1', 'keyToCheck2'])(mockRequest, mockResponse, nextFn);
        expect(nextFn).not.toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should call the callback/next function', () => {
        const mockRequest = {
            body: {
                keyToCheck: 'test',
            },
        };
        const nextFn = jest.fn();
        validateBody(['keyToCheck'])(mockRequest, mockResponse, nextFn);
        expect(nextFn).toHaveBeenCalled();
    });
});

describe('validateQuery', () => {
    let mockResponse;

    beforeEach(() => {
        mockResponse = {
            status: jest.fn(() => mockResponse),
            send: jest.fn(),
        };
    });

    it('should reject a request if missing query', () => {
        mockResponse = {
            status: jest.fn(code => {
                expect(code).toEqual(HttpStatusCode.UnprocessableEntity);
                return mockResponse;
            }),
            send: jest.fn(),
        };

        const mockRequest : Partial<Request<ParamsDictionary>> = {};
        const nextFn = jest.fn();
        validateQuery([])(mockRequest, mockResponse, nextFn);
        expect(nextFn).not.toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should reject a request if missing key in query', () => {
        mockResponse = {
            status: jest.fn(code => {
                expect(code).toEqual(HttpStatusCode.UnprocessableEntity);
                return mockResponse;
            }),
            send: jest.fn(),
        };
        const mockRequest = {
            query: {
                test: 'test',
            },
        };

        const nextFn = jest.fn();
        validateQuery(['keyToCheck'])(mockRequest, mockResponse, nextFn);
        expect(nextFn).not.toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should find keys in query', () => {
        const mockRequest = {
            query: {
                keyToCheck1: 'test',
                keyToCheck2: 'test',
            },
        };

        const nextFn = jest.fn();
        validateQuery(['keyToCheck1', 'keyToCheck2'])(mockRequest, mockResponse, nextFn);
        expect(nextFn).toHaveBeenCalled();
    });

    it('should not be valid if not all keys exist in body', () => {
        const mockRequest = {
            query: {
                keyToCheck1: 'test',
            },
        };

        const nextFn = jest.fn();
        validateQuery(['keyToCheck1', 'keyToCheck2'])(mockRequest, mockResponse, nextFn);
        expect(nextFn).not.toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should call the callback/next function', () => {
        const mockRequest = {
            query: {
                keyToCheck: 'test',
            },
        };
        const nextFn = jest.fn();
        validateQuery(['keyToCheck'])(mockRequest, mockResponse, nextFn);
        expect(nextFn).toHaveBeenCalled();
    });
});
