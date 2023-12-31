import { AxiosInstance, AxiosInterceptorOptions, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { IAxiosRetryConfigExtended } from 'axios-retry';
export interface Interceptor<V> {
    onFulfilled?: ((value: V) => V | Promise<V>) | undefined;
    onRejected?: ((error: any) => any) | undefined;
    options?: AxiosInterceptorOptions;
}
export interface RateLimitOptions {
    maxRequests?: number;
    perMilliseconds?: number;
    maxRPS?: number;
}
export interface AxiosDecoratorClass<T> {
    getClient: () => AxiosInstance;
    addRequestInterceptor: (interceptor: Interceptor<InternalAxiosRequestConfig>) => T;
    addResponseInterceptor: (interceptor: Interceptor<AxiosResponse>) => T;
    addRateLimiter: (options: RateLimitOptions) => T;
    addRateLimitRetry: (options?: IAxiosRetryConfigExtended) => T;
    addErrorLogReducer: () => T;
}
