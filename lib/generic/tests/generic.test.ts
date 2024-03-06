import { randomElement, decapitalizeFirstLetter, randomRange, roundToNearest, convertTimeStringToSeconds } from '../index';

describe('convertTimeStringToSeconds function', () => {
    test('should convert minutes to seconds correctly', () => {
        const result = convertTimeStringToSeconds('5 min');
        expect(result).toBe(300);
    });

    test('should convert seconds to seconds correctly', () => {
        const result = convertTimeStringToSeconds('30 sec');
        expect(result).toBe(30);
    });

    test('should handle mixed time string correctly', () => {
        const result = convertTimeStringToSeconds('2 min 30 sec');
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
        expect(randomElement([1, 2, 3, 4, 5, 6, 7, 8])).toEqual(3);
    });
});

describe('decapitalizeFirstLetter()', () => {
    test('should decapitalize the first letter of a string', () => {
        expect(decapitalizeFirstLetter('HELLO')).toBe('hELLO');
        expect(decapitalizeFirstLetter('Goodbye')).toBe('goodbye');
        expect(decapitalizeFirstLetter('')).toBe('');
    });
});

describe('randomRange function', () => {
    test('should generate a random number within the given range', () => {
        const min = 0;
        const max = 100;
        const randomNumber = randomRange(min, max);

        expect(randomNumber).toBeGreaterThanOrEqual(min);
        expect(randomNumber).toBeLessThanOrEqual(max);
    });

    test('should return the min value if min equals max', () => {
        const min = 50;
        const max = 50;
        const randomNumber = randomRange(min, max);

        expect(randomNumber).toEqual(min);
    });
});

describe('roundToNearest function', () => {
    test('should round a number to the nearest 2 digits by default', () => {
        const result = roundToNearest(5.667);
        expect(result).toBe(5.67);
    });

    test('should round a number to the specified number of digits', () => {
        const result = roundToNearest(5.6789, 1);
        expect(result).toBe(5.7);
    });
});