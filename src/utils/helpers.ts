import {
    isSame,
    isAfter,
    isBefore,
    dayNumber,
    daysInMonth,
    setFirstDayOfMonth,
    toDate
} from "../utils/date";
import { DateRange } from "./event-store";

export const weekDayNumbers = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
};

export type WeekStarts = keyof typeof weekDayNumbers;

export function isInRange(date: Date, range: DateRange) {
    const { from: rawFrom, to: rawTo } = range;
    const { from, to } = rangeOf(rawFrom, rawTo);

    const isBeforeTo = Boolean(to && (isSame(date, toDate(to)) || isBefore(date, toDate(to))));
    const isAfterFrom = Boolean(from && (isSame(date, toDate(from)) || isAfter(date, toDate(from))));

    return (from && to) ? (isBeforeTo && isAfterFrom) : (isAfterFrom || isBeforeTo);
}

export function isWeekendCheck (dayNumber: number): boolean {
    return dayNumber === 6 || dayNumber === 0;
}

export function calculatePrevMonthLength(date: Date, opts?: { isFixed: boolean, weekStartsOn: WeekStarts }): number {
    const { isFixed, weekStartsOn = 'monday' } = opts || {};
    const firstDayNumber = dayNumber(setFirstDayOfMonth(date));
    const weekStartsOnNum = weekDayNumbers[weekStartsOn] ?? 1;

    return isFixed && firstDayNumber === 1 ? 7 : firstDayNumber - weekStartsOnNum;
}

export function calculateMonthLength (date: Date): number {
    const currMonthLength = daysInMonth(date);
    const prevMonthLength = calculatePrevMonthLength(date);
    
    const prevLength = prevMonthLength + currMonthLength;
    const nextLength = 7 - (prevLength % 7);

    return prevLength + (nextLength === 7 ? 0 : nextLength);
}

export function getMonthLength(date: Date, isFixed: boolean): number {
    return isFixed ? 42 : calculateMonthLength(date);
}

export function rangeOf(begin: Date | undefined, end: Date | undefined) {
    if (!begin || !end) return { from: begin, to: end };

    const [from, to] = isBefore(begin, end) ? [begin, end] : [end, begin];
    return { from, to }
}
