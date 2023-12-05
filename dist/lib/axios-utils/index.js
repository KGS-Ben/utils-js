"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosDecorator = void 0;
const axios_1 = __importStar(require("axios"));
const axios_rate_limit_1 = __importDefault(require("axios-rate-limit"));
const axios_retry_1 = __importStar(require("axios-retry"));
__exportStar(require("./types/AxiosDecorator"), exports);
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
class AxiosDecorator {
    axiosInstance;
    /**
     * Constructor
     *
     * @param axiosOptions Axios constructor options
     */
    constructor(axiosOptions) {
        this.axiosInstance = axios_1.default.create(axiosOptions);
    }
    /**
     * Get the resulting axios instance after configuring all functionality.
     *
     * @returns {AxiosInstance} An axios instance with all the configured functionality applied.
     */
    getClient() {
        return this.axiosInstance;
    }
    /**
     * Add a rate limiter interceptor to the axios instance.
     *
     * @param rateLimitConfig Rate limit options specified by axios-rate-limit module
     * @returns {AxiosDecorator} AxiosDecorator
     */
    addRateLimiter(rateLimitConfig) {
        this.axiosInstance = (0, axios_rate_limit_1.default)(this.axiosInstance, rateLimitConfig);
        return this;
    }
    /**
     * Retry failed requests due to rate limit reached.
     * Default: Use exponential backoff.
     *
     * @param retryConfig Settings for retrying a request
     * @returns AxiosDecorator
     */
    addRateLimitRetry(retryConfig) {
        const defaultConfig = {
            retryDelay: axios_retry_1.exponentialDelay,
            retryCondition: (error) => {
                if (error?.response && error?.response?.status === axios_1.HttpStatusCode.TooManyRequests) {
                    return true;
                }
                return axios_retry_1.default.isNetworkOrIdempotentRequestError(error);
            },
        };
        retryConfig = { ...defaultConfig, ...retryConfig };
        (0, axios_retry_1.default)(this.axiosInstance, retryConfig);
        return this;
    }
    /**
     * Add a new request interceptor
     *
     * @param interceptor Request Interceptor to add to the axios instance
     * @returns AxiosDecorator
     */
    addRequestInterceptor(interceptor) {
        this.axiosInstance.interceptors.request.use(interceptor.onFulfilled, interceptor.onRejected, interceptor.options);
        return this;
    }
    /**
     * Add a new response interceptor
     *
     * @param interceptor Response Interceptor to add to the axios instance
     * @returns AxiosDecorator
     */
    addResponseInterceptor(interceptor) {
        this.axiosInstance.interceptors.response.use(interceptor.onFulfilled, interceptor.onRejected, interceptor.options);
        return this;
    }
    /**
     * Simplify the axios errors for easier logging.
     *
     * @returns AxiosDecorator
     */
    addErrorLogReducer() {
        const axiosLogReducer = (error) => {
            if (error?.response) {
                return Promise.reject({
                    status: error.response.status,
                    message: error.message,
                    data: error.response.data,
                });
            }
            else if (error.request) {
                // Some error setting up the request
                return Promise.reject({
                    message: error.cause?.message || error.message || 'Request failed to send',
                    request: error.request,
                });
            }
            return Promise.reject(error);
        };
        this.addRequestInterceptor({
            onRejected: axiosLogReducer,
        });
        this.addResponseInterceptor({
            onRejected: axiosLogReducer,
        });
        return this;
    }
}
exports.AxiosDecorator = AxiosDecorator;
//# sourceMappingURL=index.js.map