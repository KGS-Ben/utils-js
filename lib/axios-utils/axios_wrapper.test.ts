import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { AxiosBuilder } from "./axios_wrapper";
import nock from 'nock';

/**
 * Mock http requests with a list of responses.
 *
 * @param client Axios instance to make http requests with
 * @param responses List of response functions to respond to the http requests
 */
function setupResponses(client : AxiosInstance, responses : Array<Function>) {
    const configureResponse = () => {
        const response = responses.shift();

        if (response) {
            // Attach nock interceptor response
            response();
        }
    };

    // Nock interceptors are consumed on us, set the next response
    client.interceptors.response.use(
        (result : AxiosResponse) => {
            configureResponse();
            return result;
        },
        (error : AxiosError) => {
            console.log(error);
            configureResponse();
            return Promise.reject(error);
        }
    );

    configureResponse();
}

// describe('build',() => {
//     it('should build into an axios instance', () => {
//         let httpClient = new AxiosBuilder({ baseURL: 'http://test.com'}).build();
//         httpClient instanceof axios;

//         expect(httpClient.defaults.baseURL).toEqual('http://test.com');
//     });
// })

// describe('addRateLimiter', () => {
//     afterEach(() => {
//         nock.cleanAll();
//     });

//     it('should throttle the number of requests over a time period', async () => {
//         const totalRequests = 4
//         const rateLimitOptions = Object.freeze({
//             maxRequests: 1,
//             perMilliseconds: 100,
//         });
//         const successCallback = jest.fn(async () => {});
//         let httpClient = new AxiosBuilder({ baseURL: 'http://www.test.com'}).addRateLimiter(rateLimitOptions).build();
//         let responses = Array();
//         for (let i = 0; i < totalRequests; i++) {
//             responses.push(() => nock('http://www.test.com/').get('/data').reply(200));
//         }

//         setupResponses(httpClient, responses);

//         var start = Date.now()
//         for (let i = 0; i < totalRequests; i++) {
//             // Need to do requests one-by-one otherwise race condition w/ mock response
//             await httpClient.get('http://www.test.com/data').then(successCallback);
//         }
        
//         var end = Date.now();

//         expect(successCallback).toHaveBeenCalledTimes(totalRequests);
//         expect(end - start).toBeGreaterThanOrEqual(300)
//     });
// });

describe('addRateLimitRetry', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('should retry a request if Rate limit reached (TooManyRequests)', async () => {
        const successCallback = jest.fn();
        const retryCallback = jest.fn();

        let httpClient = new AxiosBuilder({ baseURL: 'http://www.test.com'}).addRateLimitRetry({ retryDelay: () => 1000, onRetry: retryCallback}).build();
        let responses = Array();
        // responses.push(() => nock('http://www.test.com/').get('/data').reply(429));
        responses.push(() => nock('http://www.test.com/').get('/data').reply(429));
        responses.push(() => nock('http://www.test.com/').get('/data').reply(200));

        setupResponses(httpClient, responses);

        await httpClient.get('http://www.test.com/data').then(successCallback);

        expect(successCallback).toHaveBeenCalledTimes(1);
        expect(retryCallback).toHaveBeenCalledTimes(2);
    });
});