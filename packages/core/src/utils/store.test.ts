import { toDate } from './date';
import {
	add,
	addAll,
	clear,
	createStore,
	dateToggle,
	excludeState,
	extractRange,
	includes,
	initStateToRanges,
	is,
	pop,
	push,
	remove,
	replace,
	sort
} from './store';
import { flushPromises } from './test-utils';
import type {
	DateRange } from './store';

describe('Utils: event-store', () => {
	const date1 = toDate('2023-01-01');
	const date2 = toDate('2023-01-02');
	const date3 = toDate('2023-01-03');
	const date4 = toDate('2023-01-04');
	const date5 = toDate('2023-01-05');
	const date6 = toDate('2023-01-06');

	it('initStateToEvents: should return an array of events', () => {
		const stringDate1 = '2023-01-05';
		const stringDate2 = '2023-01-06';

		const dateEvent1: DateRange = { from: date1, to: date1 };

		expect(initStateToRanges()).toEqual([]);
		expect(initStateToRanges({})).toEqual([]);
		expect(initStateToRanges({ initState: [] })).toEqual([]);

		const [range] = initStateToRanges({ initState: [{ from: date1, to: date1 }] });

		expect(range).toEqual(dateEvent1);

		const [dateRange] = initStateToRanges({ initState: [date1] });

		expect(dateRange).toEqual(dateEvent1);

		const [range1, range2] = initStateToRanges({ initState: [date1, date2] });

		expect(range1).toEqual({ from: toDate(date1), to: toDate(date1) });
		expect(range2).toEqual({ from: toDate(date2), to: toDate(date2) });

		const customParser = vi.fn((date: string) => toDate(date));

		expect(initStateToRanges({ customParser })).toEqual([]);

		const [range3, range4] = initStateToRanges({ initState: [stringDate1, stringDate2], customParser });

		expect(range3).toEqual({ from: toDate(stringDate1), to: toDate(stringDate1) });
		expect(range4).toEqual({ from: toDate(stringDate2), to: toDate(stringDate2) });

		expect(customParser).toHaveBeenCalledTimes(2);
		expect(customParser).toHaveBeenCalledWith(stringDate1);
		expect(customParser).toHaveBeenCalledWith(stringDate2);
		expect(customParser).toHaveReturnedWith(toDate(stringDate1));
		expect(customParser).toHaveReturnedWith(toDate(stringDate2));
	});

	it('createEventStore: should return an event store', async () => {
		const ranges = initStateToRanges();
		const store = createStore(ranges);

		expect(store.getState()).toEqual(ranges);

		const range: DateRange = { from: date1, to: date1 };
		store.publish(range);
		store.publish(range);

		expect(store.getState()).toEqual([{ from: date1, to: date1 }]);

		const subscriber = vi.fn();
		store.subscribe(subscriber);

		await flushPromises();

		expect(subscriber).toHaveBeenCalledTimes(1);

		store.publish({ from: date1, to: date2 });

		await flushPromises();

		expect(subscriber).toHaveBeenCalledTimes(2);

		store.publish({ from: date1, to: date3 });
		store.publish({ from: date1, to: date4 });

		await flushPromises();

		expect(subscriber).toHaveBeenCalledTimes(3);
		expect(store.getState()).toEqual([{ from: date1, to: date4 }]);

		const removeRange1: DateRange = { from: date1, to: date1 };
		store.remove(removeRange1);

		await flushPromises();

		expect(store.getState()).toEqual([{ from: date2, to: date4 }]);
		expect(subscriber).toHaveBeenCalledTimes(4);

		const removeRange2: DateRange = { from: date4, to: date4 };
		store.remove(removeRange2);

		await flushPromises();

		expect(store.getState()).toEqual([{ from: date2, to: date3 }]);
		expect(subscriber).toHaveBeenCalledTimes(5);

		store.clear();

		await flushPromises();

		expect(subscriber).toHaveBeenCalledTimes(6);
		expect(store.getState()).toEqual([]);

		const addRange1 = { from: date5, to: date5 };

		store.publish(addRange1);
		expect(store.getState()).toEqual([{ from: date5, to: date5 }]);

		store.remove(addRange1);
		expect(store.getState()).toEqual([]);

		await flushPromises();

		expect(subscriber).toHaveBeenCalledTimes(7);
	});

	it('includes: should return boolean value, true if date is included in ranges', () => {
		let ranges = initStateToRanges();

		const addRange = { from: date1, to: date1 };

		ranges = push(ranges, addRange);

		expect(includes(ranges, date1)).toBe(true);

		ranges = push(ranges, ({ from: date1, to: date4 }));

		expect(includes(ranges, date1)).toBe(true);
		expect(includes(ranges, date2)).toBe(true);

		const removeRange = { from: date2, to: date2 };

		ranges = pop(ranges, removeRange);

		expect(includes(ranges, date1)).toBe(true);
		expect(includes(ranges, date3)).toBe(true);
		expect(includes(ranges, date4)).toBe(true);
		expect(includes(ranges, date2)).toBe(false);
		expect(includes(ranges, date5)).toBe(false);
		expect(includes(ranges, date6)).toBe(false);
	});

	it('mergeAddEvent: should return meged date ranges', () => {
		const ranges = [
			{ from: date2, to: date3 },
			{ from: date3, to: date4 }
		];

		expect(push(ranges, { from: date1, to: date1 })).toEqual([
			{ from: date2, to: date3 },
			{ from: date3, to: date4 },
			{ from: date1, to: date1 }
		]);

		expect(push(ranges, { from: date1 })).toEqual([{ from: date1 }]);
		expect(push(ranges, { from: date3 })).toEqual([{ from: date2 }]);
		expect(push(ranges, { to: date4 })).toEqual([{ to: date4 }]);
		expect(push(ranges, { to: date3 })).toEqual([{ to: date4 }]);
		expect(push(ranges, { from: date1, to: date3 })).toEqual([{ from: date1, to: date4 }]);
	});

	it('mergeRemoveEvent: should return meged date ranges', () => {
		const ranges = [
			{ from: date1, to: date3 }
		];

		expect(pop(ranges, { from: date1 })).toEqual([]);
		expect(pop(ranges, { from: date2 })).toEqual([{ from: date1, to: date1 }]);
		expect(pop(ranges, { from: date3 })).toEqual([{ from: date1, to: date2 }]);
		expect(pop(ranges, { to: date4 })).toEqual([]);
		expect(pop(ranges, { to: date3 })).toEqual([]);
		expect(pop(ranges, { to: date2 })).toEqual([{ from: date3, to: date3 }]);
		expect(pop(ranges, { to: date1 })).toEqual([{ from: date2, to: date3 }]);
		expect(pop(ranges, { from: date1, to: date1 })).toEqual([{ from: date2, to: date3 }]);
		expect(pop(ranges, { from: date1, to: date2 })).toEqual([{ from: date3, to: date3 }]);
		expect(pop(ranges, { from: date2, to: date2 })).toEqual([{ from: date1, to: date1 }, { from: date3, to: date3 }]);
	});

	it('excludeState', () => {
		const selected = [
			{ from: date1, to: date3 },
			{ from: date4, to: date6 }
		];

		const disabled = [
			{ from: date2, to: date4 },
			{ from: date6, to: date6 }
		];

		expect(excludeState(selected, disabled)).toEqual([
			{ from: date1, to: date1 },
			{ from: date5, to: date5 }
		]);
	});

	it('extractRange', () => {
		const range1 = { from: date1 };
		const range2 = { to: date2 };
		const range3 = { from: date3, to: date4 };

		expect(extractRange(range1)).toEqual([date1.getTime(), Infinity]);
		expect(extractRange(range2)).toEqual([-Infinity, date2.getTime()]);
		expect(extractRange(range3)).toEqual([date3.getTime(), date4.getTime()]);
	});

	it('is', () => {
		const store = createStore([]);
		store.publish({ from: date1, to: date1 });

		expect(is(store, date1)).toBe(true);
		expect(is(store, date2)).toBe(false);
		expect(is(store, date3)).toBe(false);

		store.remove({ from: date1, to: date1 });
		store.publish({ from: date2, to: date2 });

		expect(is(store, date1)).toEqual(false);
		expect(is(store, date2)).toEqual(true);
		expect(is(store, date3)).toEqual(false);
	});

	it('add', () => {
		const store = createStore([]);
		add(store, date1);

		expect(store.getState()).toEqual([{ from: date1, to: date1 }]);

		add(store, {
			from: date1,
			to: date2
		});

		expect(store.getState()).toEqual([{ from: date1, to: date2 }]);

		add(store, {
			from: date5,
			to: date6
		});

		expect(store.getState()).toEqual([{ from: date1, to: date2 }, { from: date5, to: date6 }]);
	});

	it('addAll', () => {
		const store = createStore([]);
		addAll(store);

		expect(store.getState()).toEqual([{}]);
	});

	it('remove', () => {
		const store = createStore([]);
		store.publish({ from: date1, to: date1 });

		expect(store.getState()).toEqual([{ from: date1, to: date1 }]);

		remove(store, date1);

		expect(store.getState()).toEqual([]);

		store.publish({ from: date2, to: date2 });
		store.publish({ from: date4, to: date4 });
		store.publish({ from: date6, to: date6 });

		expect(store.getState()).toEqual([{ from: date2, to: date2 }, { from: date4, to: date4 }, { from: date6, to: date6 }]);

		remove(store, {
			from: date4,
			to: date6
		});

		expect(store.getState()).toEqual([{ from: date2, to: date2 }]);

		remove(store, {
			from: date1,
			to: date6
		});

		expect(store.getState()).toEqual([]);
	});

	it('replace', () => {
		const store = createStore([]);
		replace(store, date1);

		expect(store.getState()).toEqual([{ from: date1, to: date1 }]);

		replace(store, {
			from: date1,
			to: date2
		});

		expect(store.getState()).toEqual([{ from: date1, to: date2 }]);

		replace(store, {
			from: date5,
			to: date6
		});

		expect(store.getState()).toEqual([{ from: date5, to: date6 }]);
	});

	it('dateToggle', () => {
		const store = createStore([]);

		dateToggle(store, date1);
		expect(store.getState()).toEqual([{ from: date1, to: date1 }]);

		dateToggle(store, date1);
		expect(store.getState()).toEqual([]);

		dateToggle(store, date2);
		expect(store.getState()).toEqual([{ from: date2, to: date2 }]);

		dateToggle(store, date2);
		expect(store.getState()).toEqual([]);
	});

	it('clear', () => {
		const store = createStore([]);

		store.publish({ from: date1, to: date1 });
		store.publish({ from: date2, to: date2 });
		store.publish({ from: date3, to: date3 });

		clear(store);

		expect(store.getState()).toEqual([]);
	});

	it('sort', () => {
		const ranges1: DateRange[] = [
			{ from: date3, to: date3 },
			{ from: date1, to: date1 },
			{ from: date2, to: date2 }
		];

		expect (sort(ranges1)).toEqual([
			{ from: date1, to: date1 },
			{ from: date2, to: date2 },
			{ from: date3, to: date3 }
		]);

		const ranges2: DateRange[] = [
			{ from: date3, to: date3 },
			{ to: date2 },
			{ from: date1, to: date1 }
		];

		expect (sort(ranges2)).toEqual([
			{ to: date2 },
			{ from: date1, to: date1 },
			{ from: date3, to: date3 }
		]);

		const ranges3: DateRange[] = [
			{ to: date3 },
			{ to: date1 },
			{ to: date2 }
		];

		expect (sort(ranges3)).toEqual([
			{ to: date1 },
			{ to: date2 },
			{ to: date3 }
		]);

		const ranges4: DateRange[] = [
			{ from: date3, to: date3 },
			{ from: date3, to: date3 }
		];

		expect (sort(ranges4)).toEqual([
			{ from: date3, to: date3 },
			{ from: date3, to: date3 }
		]);
	});
});
