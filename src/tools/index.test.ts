import { rangeToDate, getRange } from ".";
import { toDate } from "../utils/date";

describe('Tools', () => {
    it ('toRange', () => {
        const date1 = toDate('2023-01-01');
        const date2 = toDate('2023-01-02');
        const date3 = toDate('2023-01-03');

        expect(getRange(date1)).toEqual({
            from: date1,
            to: date1
        });

        expect(getRange(date2)).toEqual({
            from: date2,
            to: date2
        });

        expect(getRange(date3)).toEqual({
            from: date3,
            to: date3
        });
    });

    it ('rangeToDate', () => {
        const date1 = toDate('2023-01-01');
        const date2 = toDate('2023-01-02');
        const date3 = toDate('2023-01-03');

        expect(rangeToDate({
            from: date1,
            to: date2
        })).toBe(null);

        expect(rangeToDate({
            from: date1,
            to: date3
        })).toBe(null);

        expect(rangeToDate({
            from: date1,
            to: date1
        })).toEqual(date1);
    });
});