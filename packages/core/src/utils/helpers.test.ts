import { toDate } from "./date";
import { calculateMonthLength, calculatePrevMonthLength, getMonthLength, isInRange, isWeekendCheck, rangeOf } from "./helpers";

describe('Utils: helpers', () => {
	it('isInRange', () => {
		expect(isInRange(toDate('2023-01-01'), { from: toDate('2023-01-01'), to: toDate('2023-01-02') })).toBe(true);
		expect(isInRange(toDate('2023-01-04'), { from: toDate('2023-01-01'), to: toDate('2023-01-05') })).toBe(true);
		expect(isInRange(toDate('2023-01-08'), { from: toDate('2023-01-05'), to: toDate('2023-01-08') })).toBe(true);
		expect(isInRange(toDate('2024-01-01'), { from: toDate('2023-01-10'), to: toDate('2023-01-15') })).toBe(false);
		expect(isInRange(toDate('2022-01-01'), { from: toDate('2023-01-20'), to: toDate('2023-02-06') })).toBe(false);
		expect(isInRange(toDate('2023-06-07'), { from: toDate('2023-05-01'), to: toDate('2023-10-07') })).toBe(true);

		expect(isInRange(toDate('2023-06-07'), { from: toDate('2023-05-01') })).toBe(true);
		expect(isInRange(toDate('2024-06-07'), { from: toDate('2023-05-01') })).toBe(true);
		expect(isInRange(toDate('2022-06-07'), { from: toDate('2023-05-01') })).toBe(false);

		expect(isInRange(toDate('2023-06-07'), { to: toDate('2023-10-07') })).toBe(true);
		expect(isInRange(toDate('2024-06-07'), { to: toDate('2023-10-07') })).toBe(false);
		expect(isInRange(toDate('2022-06-07'), { to: toDate('2023-10-07') })).toBe(true);
	});

	it('isWeekendCheck', () => {
		expect(isWeekendCheck(6)).toBe(true);
		expect(isWeekendCheck(0)).toBe(true);
		expect(isWeekendCheck(2)).toBe(false);
		expect(isWeekendCheck(4)).toBe(false);
	});

	it('getPrevMonthLength', () => {
		expect(calculatePrevMonthLength(toDate('2023-01-01'), 1)).toBe(6);
		expect(calculatePrevMonthLength(toDate('2023-02-01'), 1)).toBe(2);
		expect(calculatePrevMonthLength(toDate('2023-03-01'), 1)).toBe(2);
		expect(calculatePrevMonthLength(toDate('2023-04-01'), 1)).toBe(5);
		expect(calculatePrevMonthLength(toDate('2023-05-01'), 1)).toBe(7);
		expect(calculatePrevMonthLength(toDate('2023-06-01'), 1)).toBe(3);
		expect(calculatePrevMonthLength(toDate('2023-07-01'), 1)).toBe(5);
		expect(calculatePrevMonthLength(toDate('2023-08-01'), 1)).toBe(1);
		expect(calculatePrevMonthLength(toDate('2023-09-01'), 1)).toBe(4);
		expect(calculatePrevMonthLength(toDate('2023-10-01'), 1)).toBe(6);
		expect(calculatePrevMonthLength(toDate('2023-11-01'), 1)).toBe(2);
		expect(calculatePrevMonthLength(toDate('2023-12-01'), 1)).toBe(4);

		expect(calculatePrevMonthLength(toDate('2023-01-01'), 0)).toBe(7);
		expect(calculatePrevMonthLength(toDate('2023-02-01'), 0)).toBe(3);
		expect(calculatePrevMonthLength(toDate('2023-03-01'), 0)).toBe(3);
		expect(calculatePrevMonthLength(toDate('2023-04-01'), 0)).toBe(6);
		expect(calculatePrevMonthLength(toDate('2023-05-01'), 0)).toBe(1);
		expect(calculatePrevMonthLength(toDate('2023-06-01'), 0)).toBe(4);
		expect(calculatePrevMonthLength(toDate('2023-07-01'), 0)).toBe(6);
		expect(calculatePrevMonthLength(toDate('2023-08-01'), 0)).toBe(2);
		expect(calculatePrevMonthLength(toDate('2023-09-01'), 0)).toBe(5);
		expect(calculatePrevMonthLength(toDate('2023-10-01'), 0)).toBe(7);
		expect(calculatePrevMonthLength(toDate('2023-11-01'), 0)).toBe(3);
		expect(calculatePrevMonthLength(toDate('2023-12-01'), 0)).toBe(5);
	});

	it('calcMonthLength', () => {
		expect(calculateMonthLength(toDate('2023-01-01'), 1)).toBe(42);
		expect(calculateMonthLength(toDate('2023-02-01'), 1)).toBe(35);
		expect(calculateMonthLength(toDate('2023-03-01'), 1)).toBe(35);
		expect(calculateMonthLength(toDate('2023-04-01'), 1)).toBe(35);
		expect(calculateMonthLength(toDate('2023-05-01'), 1)).toBe(42);
		expect(calculateMonthLength(toDate('2023-06-01'), 1)).toBe(35);
		expect(calculateMonthLength(toDate('2023-07-01'), 1)).toBe(42);
		expect(calculateMonthLength(toDate('2023-08-01'), 1)).toBe(35);
		expect(calculateMonthLength(toDate('2023-09-01'), 1)).toBe(35);
		expect(calculateMonthLength(toDate('2023-10-01'), 1)).toBe(42);
		expect(calculateMonthLength(toDate('2023-11-01'), 1)).toBe(35);
		expect(calculateMonthLength(toDate('2023-12-01'), 1)).toBe(35);
	});

	it('getGridLength', () => {
		expect(getMonthLength(toDate('2023-01-01'), { isFixed: false, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-02-01'), { isFixed: false, weekStartsOn: 1 })).toBe(35);
		expect(getMonthLength(toDate('2023-03-01'), { isFixed: false, weekStartsOn: 1 })).toBe(35);
		expect(getMonthLength(toDate('2023-04-01'), { isFixed: false, weekStartsOn: 1 })).toBe(35);
		expect(getMonthLength(toDate('2023-05-01'), { isFixed: false, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-06-01'), { isFixed: false, weekStartsOn: 1 })).toBe(35);
		expect(getMonthLength(toDate('2023-07-01'), { isFixed: false, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-08-01'), { isFixed: false, weekStartsOn: 1 })).toBe(35);
		expect(getMonthLength(toDate('2023-09-01'), { isFixed: false, weekStartsOn: 1 })).toBe(35);
		expect(getMonthLength(toDate('2023-10-01'), { isFixed: false, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-11-01'), { isFixed: false, weekStartsOn: 1 })).toBe(35);
		expect(getMonthLength(toDate('2023-12-01'), { isFixed: false, weekStartsOn: 1 })).toBe(35);

		expect(getMonthLength(toDate('2023-01-01'), { isFixed: true, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-02-01'), { isFixed: true, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-03-01'), { isFixed: true, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-04-01'), { isFixed: true, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-05-01'), { isFixed: true, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-06-01'), { isFixed: true, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-07-01'), { isFixed: true, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-08-01'), { isFixed: true, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-09-01'), { isFixed: true, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-10-01'), { isFixed: true, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-11-01'), { isFixed: true, weekStartsOn: 1 })).toBe(42);
		expect(getMonthLength(toDate('2023-12-01'), { isFixed: true, weekStartsOn: 1 })).toBe(42);
	});

	it('rangeOf', () => {
		const date1 = toDate('2023-01-01');
		const date2 = toDate('2023-01-02');
		expect(rangeOf(undefined, undefined)).toEqual({ from: undefined, to: undefined });
		expect(rangeOf(date1, undefined)).toEqual({ from: date1, to: undefined });
		expect(rangeOf(undefined, date2)).toEqual({ from: undefined, to: date2 });
		expect(rangeOf(date1, date2)).toEqual({ from: date1, to: date2 });
		expect(rangeOf(date2, date1)).toEqual({ from: date1, to: date2 });
	});
});
