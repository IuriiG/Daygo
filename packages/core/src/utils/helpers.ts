import {
	dayNumber,
	daysInMonth,
	isAfter,
	isBefore,
	isSame,
	setFirstDayOfMonth,
	toDate
} from "./date";
import type { DateRange } from "./store";

export type WeekStarts = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function isInRange(date: Date, range: DateRange) {
	const { from: rawFrom, to: rawTo } = range;
	const { from, to } = rangeOf(rawFrom, rawTo);

	if (!from && !to) return true;

	const isBeforeTo = Boolean(to && (isSame(date, toDate(to)) || isBefore(date, toDate(to))));
	const isAfterFrom = Boolean(from && (isSame(date, toDate(from)) || isAfter(date, toDate(from))));

	return (from && to) ? (isBeforeTo && isAfterFrom) : (isAfterFrom || isBeforeTo);
}

export function isWeekendCheck (dayNum: number): boolean {
	return dayNum === 6 || dayNum === 0;
}

export function calculatePrevMonthLength(date: Date, weekStartsOn: WeekStarts): number {
	const firstDayNumber = dayNumber(setFirstDayOfMonth(date)) - weekStartsOn;

	return firstDayNumber <= 0 ? 7 + firstDayNumber : firstDayNumber;
}

export function calculateMonthLength (date: Date, weekStartsOn: WeekStarts): number {
	const currMonthLength = daysInMonth(date);
	const prevMonthLength = calculatePrevMonthLength(date, weekStartsOn);

	const prevLength = prevMonthLength + currMonthLength;
	const nextLength = 7 - (prevLength % 7);

	return prevLength + (nextLength === 7 ? 0 : nextLength);
}

export function getMonthLength(date: Date, params: {isFixed: boolean, weekStartsOn: WeekStarts}): number {
	const { isFixed, weekStartsOn } = params;
	return isFixed ? 42 : calculateMonthLength(date, weekStartsOn);
}

export function rangeOf(begin: Date | undefined, end: Date | undefined) {
	if (!begin || !end) return { from: begin, to: end };

	const [from, to] = isBefore(begin, end) ? [begin, end] : [end, begin];
	return { from, to };
}
