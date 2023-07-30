import { toDate } from "./date";
import { createEventStore } from "./event-store";
import { createRangeSelector } from "./select-range";
import { call, flushPromises } from "./test-utils";

describe('Utils: select-range', () => {
    it('createRangeSelector', async () => {
        const date1 = toDate('2023-01-01');
        const date2 = toDate('2023-01-02');
        const date3 = toDate('2023-01-03');
        const date4 = toDate('2023-01-04');
        const date5 = toDate('2023-01-05');
        const date6 = toDate('2023-01-06');

        const {updateSelector, activateSelector} = createRangeSelector();
        const store = createEventStore([]);
        const subscriber = vi.fn();

        store.subscribe(subscriber);

        
        call(() => updateSelector(store, date1), 10);

        expect(store.getState()).toEqual([]);

        activateSelector(store, date1);

        expect(store.getState()).toEqual([{from: date1, to: date1}]);

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(2);

        updateSelector(store, date2);
        expect(store.getState()).toEqual([{from: date1, to: date2}]);

        updateSelector(store, date3);
        expect(store.getState()).toEqual([{from: date1, to: date3}]);

        updateSelector(store, date4);
        expect(store.getState()).toEqual([{from: date1, to: date4}]);

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(3);

        call(() => updateSelector(store, date5), 10);

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(4);

        activateSelector(store, date5);

        expect(store.getState()).toEqual([{from: date1, to: date5}]);

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(4);

        call(() => updateSelector(store, date6), 10);

        expect(subscriber).toHaveBeenCalledTimes(4);

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(4);
    });
});
