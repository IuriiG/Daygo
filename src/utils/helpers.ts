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

export function isInRange (date: Date, disabledDate: DateRange) {
    const { from: rawFrom, to: rawTo } = disabledDate;

    const {from, to} = rangeOf(rawFrom, rawTo);

    const isBeforeTo = Boolean(to && (isSame(date, toDate(to)) || isBefore(date, toDate(to))));
    const isAfterFrom = Boolean(from && (isSame(date, toDate(from)) || isAfter(date, toDate(from))));

    if (from && to) return isBeforeTo && isAfterFrom;
    return isAfterFrom || isBeforeTo;
}

export function isWeekendCheck (dayNumber: number): boolean {
    return dayNumber === 6 || dayNumber === 7;
}

export function getPrevMonthLength(date: Date): number {
    const firstDay = setFirstDayOfMonth(date);
    const firstDayNumber = dayNumber(firstDay);

    return firstDayNumber - 1;
}

export function getCurrMonthLength(date: Date): number {
    return daysInMonth(date);
}

export function getGridLength(date: Date): number {
    const prevMonthLength = getPrevMonthLength(date);
    const currMonthLength = getCurrMonthLength(date);
    const prevLength = prevMonthLength + currMonthLength;

    const nextLength = 7 - (prevLength % 7);
    return prevMonthLength + currMonthLength + (nextLength === 7 ? 0 : nextLength);
}

export function rangeOf(begin: Date | undefined, end: Date | undefined) {
    if (!begin || !end) return {from: begin, to: end};

    const [from, to] = isBefore(begin, end) ? [begin, end] : [end, begin];
    return {from, to}
}
