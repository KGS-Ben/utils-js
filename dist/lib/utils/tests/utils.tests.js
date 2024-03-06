"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
describe('convertTimeStringToSeconds function', () => {
    test('should convert minutes to seconds correctly', () => {
        const result = (0, index_1.convertTimeStringToSeconds)('5 min');
        expect(result).toBe(300);
    });
    test('should convert seconds to seconds correctly', () => {
        const result = (0, index_1.convertTimeStringToSeconds)('30 sec');
        expect(result).toBe(30);
    });
    test('should handle mixed time string correctly', () => {
        const result = (0, index_1.convertTimeStringToSeconds)('2 min 30 sec');
        expect(result).toBe(150);
    });
});
describe('randomElement()', () => {
    beforeAll(() => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.32123);
    });
    afterAll(() => {
        jest.spyOn(global.Math, 'random').mockRestore();
    });
    it('retrieve a random element', () => {
        expect((0, index_1.randomElement)([1, 2, 3, 4, 5, 6, 7, 8])).toEqual(3);
    });
});
describe('decapitalizeFirstLetter()', () => {
    test('should decapitalize the first letter of a string', () => {
        expect((0, index_1.decapitalizeFirstLetter)('HELLO')).toBe('hELLO');
        expect((0, index_1.decapitalizeFirstLetter)('Goodbye')).toBe('goodbye');
        expect((0, index_1.decapitalizeFirstLetter)('')).toBe('');
    });
});
describe('randomRange function', () => {
    test('should generate a random number within the given range', () => {
        const min = 0;
        const max = 100;
        const randomNumber = (0, index_1.randomRange)(min, max);
        expect(randomNumber).toBeGreaterThanOrEqual(min);
        expect(randomNumber).toBeLessThanOrEqual(max);
    });
    test('should return the min value if min equals max', () => {
        const min = 50;
        const max = 50;
        const randomNumber = (0, index_1.randomRange)(min, max);
        expect(randomNumber).toEqual(min);
    });
});
describe('roundToNearest function', () => {
    test('should round a number to the nearest whole number by default', () => {
        const result = (0, index_1.roundToNearest)(5.6);
        expect(result).toBe(6);
    });
    test('should round a number to the specified number of digits', () => {
        const result = (0, index_1.roundToNearest)(5.6789, 2);
        expect(result).toBe(5.68);
    });
    test('should round a negative number to the nearest whole number', () => {
        const result = (0, index_1.roundToNearest)(-5.6);
        expect(result).toBe(-6);
    });
});
//# sourceMappingURL=utils.tests.js.map