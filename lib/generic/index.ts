/**
 * Express module for inbound request validations
 */
import fs from 'fs/promises';

/**
 * Asynchronous sleep function
 *
 * @param {number} millis - time to sleep (ms)
 * @returns {Promise<void>} - Promise that resolves after millis
 */
export async function sleep(millis: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, millis));
}

/**
 * Convert a time string like '17 min 30 sec' to seconds
 *
 * @param {String} timeString Time string
 * @returns {Number} Time in seconds
 */
export function convertTimeStringToSeconds(timeString: string): number {
    let time = 0;
    let timeRegex = /([0-9]+) (min|sec)/g;
    let match;
    try {
        while ((match = timeRegex.exec(timeString)) !== null) {
            if (match[2] === 'min') {
                time += parseInt(match[1]) * 60;
            } else if (match[2] === 'sec') {
                time += parseInt(match[1]);
            }
        }
    } catch (error) {
        console.error(`Failed to convert time string ${timeString}\n${error}`);
        time = 0;
    }

    return time;
}

/**
 * Get a random value from an array
 *
 * @param {Array<any>} array - An array of anything
 * @returns {any} - An item from the array
 */
export function randomElement(array: Array<any>): any {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Round to nearest decimal place.
 *
 * @param {Number} toRound - Number to round
 * @param {Number?} [digits=2] - Number of digits to round to >=0. Default: 2
 * @returns {Number} number rounded to nearest digits decimals
 */
export function roundToNearest(toRound: number, digits: number = 2): number {
    let tens = Math.pow(10, digits) || 1;
    return Math.round(toRound * tens) / tens;
}

/**
 * Delete any number of files.
 *
 * @param {...string} filesToDelete - List of files to delete
 */
export async function deleteFiles(...filesToDelete: string[]): Promise<void> {
    for (const filename of filesToDelete) {
        try {
            await fs.rm(filename);
        } catch (err) {
            // caller should catch this error
            throw new Error(`Failed to delete file ${filename}\n${err}`);
        }
    }
}

/**
 * Decapitalize first character of a string
 *
 * @param {string} str - String to decap
 * @returns {string} Decapped string
 */
export function decapitalizeFirstLetter(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Generate a random number within a range.
 *
 * @param {number} min Lower bound of random number
 * @param {number} max Upper bound of random number
 * @returns {number} A number within the given range. min <= x <= max
 */
export function randomRange(min: number, max: number): number {
    return min + Math.round(Math.random() * (max - min));
}
