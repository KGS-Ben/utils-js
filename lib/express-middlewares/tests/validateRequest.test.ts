import { HttpStatusCode } from 'axios';
import { validateBody, validateQuery } from '../validateRequest';
import { Request, Response } from 'express';

describe('validateBody', () => {
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockResponse = {
            status: jest.fn((code: number): Response => mockResponse as Response),
            send: jest.fn(),
        };
    });

    it('should reject a request if missing body', () => {
        mockResponse = {
            status: jest.fn(code => {
                expect(code).toEqual(HttpStatusCode.UnprocessableEntity);
                return mockResponse as Response;
            }),
            send: jest.fn(),
        };

        const mockRequest: Partial<Request> = {};
        const nextFn = jest.fn();
        validateBody([])(mockRequest as Request, mockResponse as Response, nextFn);
        expect(nextFn).not.toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should reject a request if missing key in body', () => {
        mockResponse = {
            status: jest.fn(code => {
                expect(code).toEqual(HttpStatusCode.UnprocessableEntity);
                return mockResponse as Response;
            }),
            send: jest.fn(),
        };
        const mockRequest: Partial<Request> = {
            body: {
                test: 'test',
            },
        };

        const nextFn = jest.fn();
        validateBody(['keyToCheck'])(mockRequest as Request, mockResponse as Response, nextFn);
        expect(nextFn).not.toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should find keys in body', () => {
        const mockRequest: Partial<Request> = {
            body: {
                keyToCheck1: 'test',
                keyToCheck2: 'test',
            },
        };

        const nextFn = jest.fn();
        validateBody(['keyToCheck1', 'keyToCheck2'])(
            mockRequest as Request,
            mockResponse as Response,
            nextFn
        );
        expect(nextFn).toHaveBeenCalled();
    });

    it('should not be valid if not all keys exist in body', () => {
        const mockRequest = {
            body: {
                keyToCheck1: 'test',
            },
        };

        const nextFn = jest.fn();
        validateBody(['keyToCheck1', 'keyToCheck2'])(
            mockRequest as Request,
            mockResponse as Response,
            nextFn
        );
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
        validateBody(['keyToCheck'])(mockRequest as Request, mockResponse as Response, nextFn);
        expect(nextFn).toHaveBeenCalled();
    });
});

describe('validateQuery', () => {
    let mockResponse: any;

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

        const mockRequest: Partial<Request> = {};
        const nextFn = jest.fn();
        validateQuery([])(mockRequest as Request, mockResponse as Response, nextFn);
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
        const mockRequest: Partial<Request> = {
            query: {
                test: 'test',
            },
        };

        const nextFn = jest.fn();
        validateQuery(['keyToCheck'])(mockRequest as Request, mockResponse as Response, nextFn);
        expect(nextFn).not.toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should find keys in query', () => {
        const mockRequest: Partial<Request> = {
            query: {
                keyToCheck1: 'test',
                keyToCheck2: 'test',
            },
        };

        const nextFn = jest.fn();
        validateQuery(['keyToCheck1', 'keyToCheck2'])(
            mockRequest as Request,
            mockResponse as Response,
            nextFn
        );
        expect(nextFn).toHaveBeenCalled();
    });

    it('should not be valid if not all keys exist in body', () => {
        const mockRequest: Partial<Request> = {
            query: {
                keyToCheck1: 'test',
            },
        };

        const nextFn = jest.fn();
        validateQuery(['keyToCheck1', 'keyToCheck2'])(
            mockRequest as Request,
            mockResponse as Response,
            nextFn
        );
        expect(nextFn).not.toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should call the callback/next function', () => {
        const mockRequest: Partial<Request> = {
            query: {
                keyToCheck: 'test',
            },
        };
        const nextFn = jest.fn();
        validateQuery(['keyToCheck'])(mockRequest as Request, mockResponse as Response, nextFn);
        expect(nextFn).toHaveBeenCalled();
    });
});
