import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    HttpStatusCode,
    InternalAxiosRequestConfig,
} from 'axios';
import axiosRateLimit from 'axios-rate-limit';
import axiosRetry, { IAxiosRetryConfigExtended, exponentialDelay } from 'axios-retry';
import { AxiosDecoratorClass, Interceptor, RateLimitOptions } from './types/AxiosDecorator';

/**
 * @classdesc Create and configure an axios instance
 */
export class AxiosDecorator implements AxiosDecoratorClass<AxiosDecorator> {
    private axiosInstance: AxiosInstance;

    /**
     * Constructor
     *
     * @param axiosOptions Axios constructor options
     */
    constructor(axiosOptions?: AxiosRequestConfig<any>) {
        this.axiosInstance = axios.create(axiosOptions);
    }

    /**
     * Get the resulting axios instance after configuring all functionality.
     *
     * @returns {AxiosInstance} An axios instance with all the configured functionality applied.
     */
    public getClient() {
        return this.axiosInstance;
    }

    /**
     * Add a rate limiter interceptor to the axios instance.
     *
     * @param rateLimitConfig Rate limit options specified by axios-rate-limit module
     * @returns {AxiosDecorator} AxiosDecorator
     */
    public addRateLimiter(rateLimitConfig: RateLimitOptions): AxiosDecorator {
        this.axiosInstance = axiosRateLimit(this.axiosInstance, rateLimitConfig);

        return this;
    }

    /**
     * Retry failed requests due to rate limit reached.
     * Default: Use exponential backoff.
     *
     * @param retryConfig Settings for retrying a request
     * @returns AxiosDecorator
     */
    public addRateLimitRetry(retryConfig?: IAxiosRetryConfigExtended): AxiosDecorator {
        const defaultConfig = {
            retryDelay: exponentialDelay,
            retryCondition: (error: AxiosError): boolean | Promise<boolean> => {
                if (error?.response && error?.response?.status === HttpStatusCode.TooManyRequests) {
                    return true;
                }

                return axiosRetry.isNetworkOrIdempotentRequestError(error);
            },
        };

        retryConfig = { ...defaultConfig, ...retryConfig };
        axiosRetry(this.axiosInstance, retryConfig);
        return this;
    }

    /**
     * Add a new request interceptor
     *
     * @param interceptor Request Interceptor to add to the axios instance
     * @returns AxiosDecorator
     */
    public addRequestInterceptor(interceptor: Interceptor<InternalAxiosRequestConfig>) {
        this.axiosInstance.interceptors.request.use(
            interceptor.onFulfilled,
            interceptor.onRejected,
            interceptor.options
        );
        return this;
    }

    /**
     * Add a new response interceptor
     *
     * @param interceptor Response Interceptor to add to the axios instance
     * @returns AxiosDecorator
     */
    public addResponseInterceptor(interceptor: Interceptor<AxiosResponse>) {
        this.axiosInstance.interceptors.response.use(
            interceptor.onFulfilled,
            interceptor.onRejected,
            interceptor.options
        );
        return this;
    }
}
