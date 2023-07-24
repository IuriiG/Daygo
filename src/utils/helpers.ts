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

export function isInRange(date: Date, disabledDate: DateRange) {
    const { from: rawFrom, to: rawTo } = disabledDate;
    const { from, to } = rangeOf(rawFrom, rawTo);

    const isBeforeTo = Boolean(to && (isSame(date, toDate(to)) || isBefore(date, toDate(to))));
    const isAfterFrom = Boolean(from && (isSame(date, toDate(from)) || isAfter(date, toDate(from))));

    return (from && to) ? (isBeforeTo && isAfterFrom) : (isAfterFrom || isBeforeTo);
}

export function isWeekendCheck (dayNumber: number): boolean {
    return dayNumber === 6 || dayNumber === 7;
}

export function getPrevMonthLength(date: Date): number {
    const firstDay = setFirstDayOfMonth(date);
    const firstDayNumber = dayNumber(firstDay);

    return firstDayNumber - 1;
}

export function calcMonthLength (date: Date): number {
    const currMonthLength = daysInMonth(date);
    const prevMonthLength = getPrevMonthLength(date);
    
    const prevLength = prevMonthLength + currMonthLength;
    const nextLength = 7 - (prevLength % 7);

    return prevLength + (nextLength === 7 ? 0 : nextLength);
}

export function getGridLength(date: Date, isFixed: boolean): number {
    return isFixed ? 42 : calcMonthLength(date);
}

export function rangeOf(begin: Date | undefined, end: Date | undefined) {
    if (!begin || !end) return { from: begin, to: end };

    const [from, to] = isBefore(begin, end) ? [begin, end] : [end, begin];
    return { from, to }
}
