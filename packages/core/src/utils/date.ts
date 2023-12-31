import { isNumber, isString, pad } from "./common";

export function isToday(date: Date) {
	return isSame(new Date(), date);
}

export function isSame(date1: Date | null | undefined, date2: Date | null | undefined): boolean {
	if (date1 && date2) return toISO(date1) === toISO(date2);
	return date1 === date2;
}

export function isBefore(date1: Date, date2: Date) {
	return date1 < date2;
}

export function isAfter(date1: Date, date2: Date) {
	return date1 > date2;
}

export function isSameMonth(date1: Date, date2: Date) {
	return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

export function daysInMonth(date: Date) {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function addMonth(date: Date, offset = 1): Date {
	const clone = cloneDate(date);
	clone.setMonth(clone.getMonth() + offset, 1);
	clone.setDate(Math.min(date.getDate(), daysInMonth(clone)));
	return clone;
}

export function subtractMonth(date: Date, offset = 1): Date {
	return addMonth(date, -offset);
}

export function cloneDate(date: Date): Date {
	return new Date(date.getTime());
}

export function subtractYear(date: Date, offset = 1): Date {
	return addMonth(date, -(offset * 12));
}

export function addYear(date: Date, offset = 1): Date {
	return addMonth(date, offset * 12);
}

export function subtractDay(date: Date, offset = 1): Date {
	return addDay(date, -offset);
}

export function addDay(date: Date, offset = 1): Date {
	const newDate = getDate(date);
	newDate.setDate(date.getDate() + offset);
	return newDate;
}

export function dayNumber(date: Date): number {
	return date.getDay();
}

export function toDate(date: Date | string) {
	const parsedDate = isString(date) ? parse(date) : date;
	return getDate(parsedDate);
}

export function setDay(date: Date, day: number | Date): Date {
	const newDate = getDate(date);
	const _day = isNumber(day) ? day : day.getDate();
	newDate.setDate(Math.min(Math.abs(_day), daysInMonth(newDate)));
	return newDate;
}

export function setMonth(date: Date, month: number | Date): Date {
	const newDate = getDate(date);
	const _month = isNumber(month) ? month : month.getMonth();
	newDate.setFullYear(date.getFullYear(), _month, 1);
	newDate.setMonth(_month, Math.min(date.getDate(), daysInMonth(newDate)));
	return newDate;
}

export function setYear(date: Date, year: number | Date): Date {
	const newDate = getDate(date);
	const _year = isNumber(year) ? year : year.getFullYear();
	newDate.setFullYear(_year);
	return newDate;
}

export function setFirstDayOfMonth(date: Date): Date {
	return setDay(date, 1);
}

export function getDate(date?: Date): Date {
	const _date = date ? new Date(date) : new Date();
	_date.setUTCHours(0, 0, 0, 0);
	return _date;
}

export function today(): Date {
	return getDate();
}

export function parse(date: string): Date {
	return new Date(Date.parse(date));
}

export function toISO(date: Date) {
	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());

	return `${year}-${month}-${day}T00:00:00.000Z`;
}
