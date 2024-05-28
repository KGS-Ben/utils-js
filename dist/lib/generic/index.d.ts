/**
 * Asynchronous sleep function
 *
 * @param {number} millis - time to sleep (ms)
 * @returns {Promise<void>} - Promise that resolves after millis
 */
export declare function sleep(millis: number): Promise<void>;
/**
 * Convert a time string like '17 min 30 sec' to seconds
 *
 * @param {String} timeString - Time string
 * @returns {Number} Time in seconds
 */
export declare function convertTimeStringToSeconds(timeString: string): number;
/**
 * Get a random value from an array
 *
 * @param {Array<any>} array - An array of anything
 * @returns {any} - An item from the array
 */
export declare function randomElement(array: Array<any>): any;
/**
 * Round to nearest decimal place.
 *
 * @param {Number} toRound - Number to round
 * @param {Number?} [digits=2] - Number of digits to round to >=0. Default: 2
 * @returns {Number} number rounded to nearest digits decimals
 */
export declare function roundToNearest(toRound: number, digits?: number): number;
/**
 * Delete any number of files.
 *
 * @param {...string} filesToDelete - List of files to delete
 * @throws {Error} - If any file fails to delete
 */
export declare function deleteFiles(...filesToDelete: string[]): Promise<void>;
/**
 * Decapitalize first character of a string
 *
 * @param {string} str - String to decap
 * @returns {string} Decapitalized string, or empty string if invalid
 */
export declare function decapitalizeFirstLetter(str: string): string;
/**
 * Generate a random number within a range.
 *
 * @param {number} min - Lower bound of random number
 * @param {number} max - Upper bound of random number
 * @returns {number} A number within the given range. min <= x <= max
 */
export declare function randomRange(min: number, max: number): number;
