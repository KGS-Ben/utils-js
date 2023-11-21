import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  HttpStatusCode,
} from "axios";
import axiosRateLimit from "axios-rate-limit";
import axiosRetry, { IAxiosRetryConfigExtended, exponentialDelay } from "axios-retry";

interface RateLimitOptions {
  maxRequests?: number;
  perMilliseconds?: number;
  maxRPS?: number;
}

interface AxiosBuilderClass<T> {
  build: () => AxiosInstance;
  addRateLimiter: (options: RateLimitOptions) => T;
  addRateLimitRetry: (options?: IAxiosRetryConfigExtended) => T;
}

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
  public build() {
    return this.axiosInstance;
  }

  /**
   * Add a rate limiter intercepter to the axios instance.
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
}
