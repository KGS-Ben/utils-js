import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from "axios";
import axiosRateLimit from "axios-rate-limit";
import axiosRetry, { IAxiosRetryConfigExtended, exponentialDelay } from "axios-retry";
import { AxiosBuilderClass, Interceptor, RateLimitOptions } from "./types/AxiosBuilder";

/**
 * @classdesc Create and configure an axios instance
 */
export class AxiosBuilder implements AxiosBuilderClass<AxiosBuilder> {
  private axiosInstance: AxiosInstance;

  /**
   * Constructor
   *
   * @param axiosOptions Axios constructor options
   */
  constructor(axiosOptions?: AxiosRequestConfig<any>){
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
   * @returns {AxiosBuilder} AxiosBuilder
   */
  public addRateLimiter(rateLimitConfig: RateLimitOptions): AxiosBuilder {
    this.axiosInstance = axiosRateLimit(this.axiosInstance, rateLimitConfig);

    return this;
  }

  /**
   * Retry failed requests due to rate limit reached.
   * Default: Use exponential backoff.
   *
   * @param retryConfig Settings for retrying a request
   * @returns AxiosBuilder
   */
  public addRateLimitRetry(
    retryConfig?: IAxiosRetryConfigExtended,
  ): AxiosBuilder {
    const defaultConfig = {
      retryDelay: exponentialDelay,
      retryCondition: (
        error: AxiosError,
      ): boolean | Promise<boolean> => {
        if (
          error?.response &&
          error?.response?.status === HttpStatusCode.TooManyRequests
        ) {
          return true;
        }

        return axiosRetry.isNetworkOrIdempotentRequestError(error);
      },
    }

    retryConfig = {...defaultConfig, ...retryConfig};
    axiosRetry(this.axiosInstance, retryConfig);
    return this;
  }

  /**
   * Add a new request interceptor
   *
   * @param interceptor Request Interceptor to add to the axios instance
   * @returns AxiosBuilder
   */
  addRequestInterceptor(interceptor: Interceptor<InternalAxiosRequestConfig>) {
    this.axiosInstance.interceptors.request.use(interceptor.onFulfilled, interceptor.onRejected, interceptor.options);
    return this;
  }

  /**
   * Add a new response interceptor
   *
   * @param interceptor Response Interceptor to add to the axios instance
   * @returns AxiosBuilder
   */
  addResponseInterceptor(interceptor: Interceptor<AxiosResponse>) {
    this.axiosInstance.interceptors.response.use(interceptor.onFulfilled, interceptor.onRejected, interceptor.options);
    return this;
  }
}
