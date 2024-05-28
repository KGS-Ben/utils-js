"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomRange = exports.decapitalizeFirstLetter = exports.deleteFiles = exports.roundToNearest = exports.randomElement = exports.convertTimeStringToSeconds = exports.sleep = void 0;
/**
 * Express module for inbound request validations
 */
const promises_1 = __importDefault(require("fs/promises"));
/**
 * Asynchronous sleep function
 *
 * @param {number} millis - time to sleep (ms)
 * @returns {Promise<void>} - Promise that resolves after millis
 */
async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}
exports.sleep = sleep;
/**
 * Convert a time string like '17 min 30 sec' to seconds
 *
 * @param {String} timeString Time string
 * @returns {Number} Time in seconds
 */
function convertTimeStringToSeconds(timeString) {
    let time = 0;
    let timeRegex = /([0-9]+) (min|sec)/g;
    let match;
    try {
        while ((match = timeRegex.exec(timeString)) !== null) {
            if (match[2] === 'min') {
                time += parseInt(match[1]) * 60;
            }
            else if (match[2] === 'sec') {
                time += parseInt(match[1]);
            }
        }
    }
    catch (error) {
        console.error(`Failed to convert time string ${timeString}\n${error}`);
        time = 0;
    }
    return time;
}
exports.convertTimeStringToSeconds = convertTimeStringToSeconds;
/**
 * Get a random value from an array
 *
 * @param {Array<any>} array - An array of anything
 * @returns {any} - An item from the array
 */
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}
exports.randomElement = randomElement;
/**
 * Round to nearest decimal place.
 *
 * @param {Number} toRound - Number to round
 * @param {Number?} [digits=2] - Number of digits to round to >=0. Default: 2
 * @returns {Number} number rounded to nearest digits decimals
 */
function roundToNearest(toRound, digits = 2) {
    let tens = Math.pow(10, digits) || 1;
    return Math.round(toRound * tens) / tens;
}
exports.roundToNearest = roundToNearest;
/**
 * Delete any number of files.
 *
 * @param {...string} filesToDelete - List of files to delete
 */
async function deleteFiles(...filesToDelete) {
    for (const filename of filesToDelete) {
        try {
            await promises_1.default.rm(filename);
        }
        catch (err) {
            // caller should catch this error
            throw new Error(`Failed to delete file ${filename}\n${err}`);
        }
    }
}
exports.deleteFiles = deleteFiles;
/**
 * Decapitalize first character of a string
 *
 * @param {string} str - String to decap
 * @returns {string} Decapped string
 */
function decapitalizeFirstLetter(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
exports.decapitalizeFirstLetter = decapitalizeFirstLetter;
/**
 * Generate a random number within a range.
 *
 * @param {number} min Lower bound of random number
 * @param {number} max Upper bound of random number
 * @returns {number} A number within the given range. min <= x <= max
 */
function randomRange(min, max) {
    return min + Math.round(Math.random() * (max - min));
}
exports.randomRange = randomRange;
//# sourceMappingURL=index.js.map