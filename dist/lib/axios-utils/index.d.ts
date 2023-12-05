import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { IAxiosRetryConfigExtended } from 'axios-retry';
import { AxiosDecoratorClass, Interceptor, RateLimitOptions } from './types/AxiosDecorator';
export * from './types/AxiosDecorator';
/**
 * @classdesc Create and configure an axios instance
 * @example <caption>Create a custom axios instance</caption>
 * const { AxiosDecorator } = require('utils/dist/axios-utils')
 * // Axios client with baseURL configured
 * const httpClient = new AxiosDecorator({ baseURL: 'http://sendText.com'})
 * // Simplify the error logs
 *   .addErrorLogReducer()
 * // Rate limit of 1000 requests per second
 *   .addRateLimiter({ maxRequests: 1000, perMilliseconds: 1000 })
 * // Get the axios instance
 *   .getClient();
 */
export declare class AxiosDecorator implements AxiosDecoratorClass<AxiosDecorator> {
    private axiosInstance;
    /**
     * Constructor
     *
     * @param axiosOptions Axios constructor options
     */
    constructor(axiosOptions?: AxiosRequestConfig<any>);
    /**
     * Get the resulting axios instance after configuring all functionality.
     *
     * @returns {AxiosInstance} An axios instance with all the configured functionality applied.
     */
    getClient(): axios.AxiosInstance;
    /**
     * Add a rate limiter interceptor to the axios instance.
     *
     * @param rateLimitConfig Rate limit options specified by axios-rate-limit module
     * @returns {AxiosDecorator} AxiosDecorator
     */
    addRateLimiter(rateLimitConfig: RateLimitOptions): AxiosDecorator;
    /**
     * Retry failed requests due to rate limit reached.
     * Default: Use exponential backoff.
     *
     * @param retryConfig Settings for retrying a request
     * @returns AxiosDecorator
     */
    addRateLimitRetry(retryConfig?: IAxiosRetryConfigExtended): AxiosDecorator;
    /**
     * Add a new request interceptor
     *
     * @param interceptor Request Interceptor to add to the axios instance
     * @returns AxiosDecorator
     */
    addRequestInterceptor(interceptor: Interceptor<InternalAxiosRequestConfig>): this;
    /**
     * Add a new response interceptor
     *
     * @param interceptor Response Interceptor to add to the axios instance
     * @returns AxiosDecorator
     */
    addResponseInterceptor(interceptor: Interceptor<AxiosResponse>): this;
    /**
     * Simplify the axios errors for easier logging.
     *
     * @returns AxiosDecorator
     */
    addErrorLogReducer(): AxiosDecorator;
}
