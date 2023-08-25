import { CustomParser } from "../types/type";
import { castDate } from "../utils/common";
import { isSame } from "../utils/date";
import { DateRange } from "../utils/event-store";

export const rangeToDate = (range: DateRange) => {
    const {from = null, to = null} = range;
    if (isSame(from, to)) return from || to;
    return null; 
};

export const getRange = (date: Date | undefined, customParser?: CustomParser) => {
    return {
        from: date && castDate(date, customParser),
        to: date && castDate(date, customParser)
    };
};

export const toValidRange = (range: DateRange, customParser?: CustomParser) => {
    return {
        from: range.from && castDate(range.from, customParser),
        to: range.to && castDate(range.to, customParser)
    };
};
