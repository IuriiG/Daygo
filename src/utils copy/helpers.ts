import { DisabledDate } from "../types";
import { isDate, isString } from "../utils/common";
import {
    isSame,
    isAfter,
    isBefore,
    dayNumber,
    daysInMonth,
    setFirstDayOfMonth,
    toDate
} from "../utils/date";

export function isSelectedCheck (date: Date, startSelection: Date | null, finishSelection: Date | null = null): boolean {
    if (!startSelection) return false;
    if (!finishSelection) return isSame(date, startSelection);
    return !isBefore(date, startSelection) && !isAfter(date, finishSelection);
}

export function isSelectionBeginCheck(date: Date, startSelection: Date | null): boolean {
    return isSame(date, startSelection);
}

export function isSelectionEndCheck(date: Date, finishSelection: Date | null): boolean {
    return isSame(date, finishSelection);
}

export function isDisabledCheck (date: Date, disabledDate: DisabledDate) {
    if (isString(disabledDate) || isDate(disabledDate)) return isSame(date, toDate(disabledDate));
    
    const { from, to } = disabledDate;

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

export const rangeOf = (begin: Date | null, end: Date | null = null) => {
    return [begin, end ? end : begin].sort((a, b) => {
        if (a && b) return a.getTime() - b.getTime();
        if (a && !b) return -1;
        if (!a && b) return 1;
        return 0;
    });
};
