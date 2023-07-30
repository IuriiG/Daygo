import { isSame } from "../utils/date";
import { DateRange } from "../utils/event-store";

export const fromRangeToDate = (range: DateRange) => {
    const {from = null, to = null} = range;
    if (isSame(from, to)) return from || to;
    return null; 
};
