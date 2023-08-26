/* eslint-disable @typescript-eslint/no-empty-function */
import { castDate, invoke, isDate, isFunction, isNumber, isString, pad, toCamelCase } from "./common";

describe('Utils: common', () => {
	it ('isNumber', () => {
		expect(isNumber(1)).toBe(true);
		expect(isNumber('1')).toBe(false);
		expect(isNumber(new Date())).toBe(false);
		expect(isNumber(NaN)).toBe(false);
		expect(isNumber(undefined)).toBe(false);
		expect(isNumber(null)).toBe(false);
		expect(isNumber({})).toBe(false);
		expect(isNumber([])).toBe(false);
		expect(isNumber(() => {})).toBe(false);
		expect(isNumber(Infinity)).toBe(false);
	});

	it ('isDate', () => {
		expect(isDate(new Date())).toBe(true);
		expect(isDate('2023-01-15')).toBe(false);
		expect(isDate(NaN)).toBe(false);
		expect(isDate(undefined)).toBe(false);
		expect(isDate(null)).toBe(false);
		expect(isDate({})).toBe(false);
		expect(isDate([])).toBe(false);
		expect(isDate(() => {})).toBe(false);
		expect(isDate(Date)).toBe(false);
	});

	it ('isString', () => {
		expect(isString(1)).toBe(false);
		expect(isString('1')).toBe(true);
		expect(isString(new Date())).toBe(false);
		expect(isString(NaN)).toBe(false);
		expect(isString(undefined)).toBe(false);
		expect(isString(null)).toBe(false);
		expect(isString({})).toBe(false);
		expect(isString([])).toBe(false);
		expect(isString(() => {})).toBe(false);
		expect(isString(Infinity)).toBe(false);
	});

	it ('isFunction', () => {
		expect(isFunction(1)).toBe(false);
		expect(isFunction('1')).toBe(false);
		expect(isFunction(new Date())).toBe(false);
		expect(isFunction(NaN)).toBe(false);
		expect(isFunction(undefined)).toBe(false);
		expect(isFunction(null)).toBe(false);
		expect(isFunction({})).toBe(false);
		expect(isFunction([])).toBe(false);
		expect(isFunction(() => {})).toBe(true);
		expect(isFunction(Infinity)).toBe(false);
	});

	it ('pad', () => {
		expect(pad(1)).toBe('01');
		expect(pad(10)).toBe('10');
	});

	it ('toCamelCase', () => {
		expect(toCamelCase('hello')).toBe('hello');
		expect(toCamelCase('hello_world')).toBe('helloWorld');
		expect(toCamelCase('HELLO_WORLD')).toBe('helloWorld');
	});

	it ('castDate', () => {
		expect(castDate(new Date())).toBeInstanceOf(Date);
		expect(castDate('2023-01-15')).toBeInstanceOf(Date);
		expect(() => castDate(NaN)).toThrowError();
		expect(() => castDate(undefined)).toThrowError();
		expect(() => castDate(null)).toThrowError();
		expect(() => castDate({})).toThrowError();
		expect(() => castDate([])).toThrowError();
		expect(() => castDate(() => {})).toThrowError();
		expect(() => castDate(Infinity)).toThrowError();

		const customParser = vi.fn((date: string) => new Date(date));

		expect(castDate('2023-01-15', customParser)).toBeInstanceOf(Date);

		expect(customParser).toBeCalledWith('2023-01-15');
		expect(customParser).toHaveBeenCalledTimes(1);
		expect(customParser).toHaveReturnedWith(new Date('2023-01-15'));
	});

	it('invoke', () => {
		const fn = vi.fn();
		invoke(fn);

		expect(fn).toHaveBeenCalledTimes(1);
	});
});
