import { isSame } from "../utils/date";
import { DateRange } from "../utils/event-store";

export const rangeToDate = (range: DateRange) => {
    const {from = null, to = null} = range;
    if (isSame(from, to)) return from || to;
    return null; 
};

export const toRange = (date: Date) => {
    return {
        from: date,
        to: date
    };
};
