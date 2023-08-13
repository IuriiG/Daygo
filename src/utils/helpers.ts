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

export type WeekStarts = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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

/**
0

2 - 0 = 2

0 1 2 3  4 5 6
30 31 1 2 3  4 5
6 7 8 9 10 11 12

 */

/**
1

2 - 1 = 1

31 1 2 3  4 5 6
7 8 9 10 11 12 13

 */

/**
2

2 - 2 = 0

25 26 27 28 29 30 31
1 2 3  4 5 6 7
8 9 10 11 12 13 14

 */
/**
3

2 - 3 = -1

26 27 28 29 30 31 1
2 3  4 5 6 7 8
9 10 11 12 13 14 15

 */

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
    return { from, to }
}
