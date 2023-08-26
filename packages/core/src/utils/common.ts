/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/ban-types */

import { getDate, parse } from "./date";
import type { ToCamelCase } from "../types/type-utils";

export function isNumber(v: unknown): v is number {
	return typeof v === 'number' && !Number.isNaN(v) && Number.isFinite(v);
}

export function isDate(v: unknown): v is Date {
	return v instanceof Date && v.toString() !== 'Invalid Date';
}

export function isString(v: unknown): v is string {
	return typeof v === 'string';
}

export function isFunction(v: unknown): v is Function {
	return typeof v === 'function';
}

export function pad(n: number): string {
	return n < 10 ? `0${n}` : `${n}`;
}

export function invoke(fn: () => void): void {
	fn();
}

export const toCamelCase = <T extends string>(s: T): ToCamelCase<T> => s
	.toLowerCase()
	.replace(/([_][a-z])/g, (group) =>
		group.toUpperCase().replace('_', '')
	) as ToCamelCase<T>;

export function isValidDateInput (date: unknown): date is Date | string {
	return isString(date) || isDate(date);
}

export const castDate = (date: unknown, customParser?: (date: string) => Date): Date => {
	if (isString(date)) date = isFunction(customParser) ? customParser(date) : parse(date);
	if (isDate(date)) return getDate(date);

	throw new Error('Unsupported date format');
};
