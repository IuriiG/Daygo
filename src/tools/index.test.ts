import { rangeToDate, getRange, toValidRange } from ".";
import { DateRange, toDate } from "../utils";

describe('Tools', () => {
    it ('getRange', () => {
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

    it ('toValidRange', () => {
        const date1 = toDate('2023-01-01');
        const date2 = toDate('2023-01-02');
        const date3 = toDate('2023-01-03');

        const range1 = {};
        const range2 = {from: date1};
        const range3 = {to: date2};
        const range4 = {from: date2, to: date3};
        const range5 = {from: '2023-01-01', to: '2023-01-02'};

        const customParser = vi.fn((date: string) => toDate(date));

        expect(toValidRange(range1)).toEqual({});
        expect(toValidRange(range2)).toEqual({from: date1});
        expect(toValidRange(range3)).toEqual({to: date2});
        expect(toValidRange(range4)).toEqual({from: date2, to: date3});
        expect(toValidRange(range5, customParser)).toEqual({from: date1, to: date2});

        expect(customParser).toHaveBeenCalledTimes(2);
        expect(customParser).toHaveBeenCalledWith('2023-01-01');
        expect(customParser).toHaveBeenCalledWith('2023-01-02');
    });
});