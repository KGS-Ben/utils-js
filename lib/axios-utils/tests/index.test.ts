import axios, { AxiosError, AxiosInstance, AxiosResponse, HttpStatusCode } from 'axios';
import nock from 'nock';
import { AxiosDecorator } from '../index';

afterEach(() => {
    nock.cleanAll();
});

/**
 * Mock http requests with a list of responses.
 *
 * @param client Axios instance to make http requests with
 * @param responses List of response functions to respond to the http requests
 */
function setupResponses(client: AxiosInstance, responses: Array<Function>) {
    const configureResponse = () => {
        const response = responses.shift();

        if (response) {
            // Attach nock interceptor response
            response();
        }
    };

    // Nock interceptors are consumed on use, set the next response
    client.interceptors.response.use(
        (result: AxiosResponse) => {
            configureResponse();
            return result;
        },
        (error: AxiosError) => {
            configureResponse();
            return Promise.reject(error);
        }
    );

    configureResponse();
}

describe('getClient', () => {
    it('should get the configured axios instance', () => {
        let httpClient = new AxiosDecorator({ baseURL: 'http://test.com' }).getClient();
        httpClient instanceof axios;

        expect(httpClient.defaults.baseURL).toEqual('http://test.com');
    });
});

describe('addRateLimiter', () => {
    it('should throttle the number of requests over a time period', async () => {
        const totalRequests = 4;
        const rateLimitOptions = Object.freeze({
            maxRequests: 1,
            perMilliseconds: 100,
        });
        const successCallback = jest.fn(async () => {});
        let httpClient = new AxiosDecorator({ baseURL: 'http://www.test.com' })
            .addRateLimiter(rateLimitOptions)
            .getClient();
        let responses = Array();
        for (let i = 0; i < totalRequests; i++) {
            responses.push(() => nock('http://www.test.com/').get('/data').reply(200));
        }

        setupResponses(httpClient, responses);

        var start = Date.now();
        for (let i = 0; i < totalRequests; i++) {
            // Need to do requests one-by-one otherwise race condition w/ mock response
            await httpClient.get('http://www.test.com/data').then(successCallback);
        }

        var end = Date.now();

        expect(successCallback).toHaveBeenCalledTimes(totalRequests);
        expect(end - start).toBeGreaterThanOrEqual(300);
    });
});

describe('addRateLimitRetry', () => {
    it('should retry a request if Rate limit reached (TooManyRequests)', async () => {
        const retryCallback = jest.fn();
        const httpClientBuilder = new AxiosDecorator({
            baseURL: 'http://www.test.com',
        });

        // Mock responses must be added prior to rate limit retry
        // due to axios-retry cloning the axios client to resend request
        setupResponses(httpClientBuilder.getClient(), [
            () =>
                nock('http://www.test.com')
                    .get('/test')
                    .times(2)
                    .reply(HttpStatusCode.TooManyRequests),
            () => nock('http://www.test.com').get('/test').reply(200, 'It worked!'),
        ]);

        httpClientBuilder.addRateLimitRetry({
            retryDelay: () => 200,
            retries: 2,
            onRetry: retryCallback,
        });

        let response = await httpClientBuilder.getClient().get('http://www.test.com/test');
        expect(response.status).toBe(200);
        expect(response.config['axios-retry']?.retryCount).toBe(2);
        expect(retryCallback).toHaveBeenCalledTimes(2);
    });
});

describe('addResponseInterceptor', () => {
    it('should handle fufilled response', async () => {
        let fufilledFn = jest.fn();
        let httpClient = new AxiosDecorator()
            .addResponseInterceptor({
                onFulfilled(value) {
                    fufilledFn();
                    return Promise.resolve(value);
                },
            })
            .getClient();

        setupResponses(httpClient, [() => nock('http://test.com').get(/.*/).reply(200)]);

        await httpClient.get('http://test.com');
        expect(fufilledFn).toHaveBeenCalledTimes(1);
    });

    it('should handle rejected response', async () => {
        let errorFn = jest.fn();
        let httpClient = new AxiosDecorator()
            .addResponseInterceptor({
                onRejected(error) {
                    errorFn();
                    return Promise.reject(error);
                },
            })
            .getClient();

        setupResponses(httpClient, [() => nock('http://test.com').get(/.*/).reply(500)]);

        try {
            await httpClient.get('http://test.com');
            throw Error("HTTP client didn't receive an error");
        } catch (_) {
            expect(errorFn).toHaveBeenCalledTimes(1);
        }
    });
});

describe('addRequestInterceptor', () => {
    it('should handle fufilled request', async () => {
        let fufilledFn = jest.fn();
        let httpClient = new AxiosDecorator()
            .addRequestInterceptor({
                onFulfilled(value) {
                    fufilledFn();
                    return Promise.resolve(value);
                },
            })
            .getClient();

        setupResponses(httpClient, [() => nock('http://test.com').get(/.*/).reply(200)]);

        await httpClient.get('http://test.com');
        expect(fufilledFn).toHaveBeenCalledTimes(1);
    });

    it('should handle rejected request', async () => {
        let errorFn = jest.fn();
        let httpClient = new AxiosDecorator()
            .addRequestInterceptor({
                onRejected(error) {
                    errorFn();
                    return Promise.reject(error);
                },
            })
            .addRequestInterceptor({
                onFulfilled(value) {
                    throw Error('Some invalid error');
                },
            })
            .getClient();

        setupResponses(httpClient, [() => nock('http://test.com').get(/.*/).reply(429)]);

        try {
            await httpClient.get('http://test.com');
            throw Error('HTTP client never threw an error');
        } catch (error) {
            expect(errorFn).toHaveBeenCalledTimes(1);
        }
    });
});

describe('addErrorLogReducer', () => {
    it.each([[{ errors: 'This is an expected error' }], [['This is an expected error']], [{}]])(
        'should create simplified response error logs',
        async errorBody => {
            const httpClient = new AxiosDecorator().addErrorLogReducer().getClient();
            setupResponses(httpClient, [
                () => nock('http://test.com').get('/').reply(429, errorBody),
            ]);

            try {
                await httpClient.get('http://test.com');
                throw Error('HTTP client did not throw an error');
            } catch (error) {
                expect(error.status).toEqual(429);
                expect(error.data).toEqual(errorBody);
                expect(error.message).toEqual('Request failed with status code 429');
            }
        }
    );

    it('should create simplified request error logs', async () => {
        const httpClient = new AxiosDecorator().addErrorLogReducer().getClient();
        setupResponses(httpClient, [
            () => nock('http://test.com').get('/').replyWithError('This is an error'),
        ]);

        try {
            await httpClient.get('http://test.com');
            throw Error('HTTP client did not throw an error');
        } catch (error) {
            expect(error.message).toEqual('This is an error');
        }
    });
});
