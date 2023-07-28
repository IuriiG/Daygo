import { toDate } from './date';
import {initStateToEvents, createEvent, EventTypes, createEventStore, queryState, mergeAddEvent, mergeRemoveEvent} from './event-store';
import { flushPromises } from './test-utils';

describe('Event-store', () => {
    const date1 = toDate('2023-01-01');
    const date2 = toDate('2023-01-02');
    const date3 = toDate('2023-01-03');
    const date4 = toDate('2023-01-04');

    it('initStateToEvents: should return an array of events', () => {
        const stringDate1 = '2023-01-05';
        const stringDate2 = '2023-01-06';

        const dateEvent1 = createEvent(EventTypes.ADD, {from: date1, to: date1});

        expect(initStateToEvents()).toEqual([]);
        expect(initStateToEvents({})).toEqual([]);
        expect(initStateToEvents({initState: []})).toEqual([]);

        const [event] = initStateToEvents({initState: [{from: date1, to: date1}]});

        expect(event.value()).toEqual(dateEvent1.value());

        const [dateEvent] = initStateToEvents({initState: [date1]});

        expect(dateEvent.value()).toEqual(dateEvent1.value());

        const [event1, event2] = initStateToEvents({initState: [date1, date2]});

        expect(event1.value()).toEqual({from: toDate(date1), to: toDate(date1)});
        expect(event2.value()).toEqual({from: toDate(date2), to: toDate(date2)});

        const customParser = vi.fn((date: string) => toDate(date));

        expect(initStateToEvents({customParser})).toEqual([]);

        const [event3, event4] = initStateToEvents({initState: [stringDate1, stringDate2], customParser});

        expect(event3.value()).toEqual({from: toDate(stringDate1), to: toDate(stringDate1)});
        expect(event4.value()).toEqual({from: toDate(stringDate2), to: toDate(stringDate2)});

        expect(customParser).toHaveBeenCalledTimes(2);
        expect(customParser).toHaveBeenCalledWith(stringDate1);
        expect(customParser).toHaveBeenCalledWith(stringDate2);
        expect(customParser).toHaveReturnedWith(toDate(stringDate1));
        expect(customParser).toHaveReturnedWith(toDate(stringDate2));
    });

    it('createEvent: should return an event', async () => {
        const event = createEvent(EventTypes.ADD, {from: date1, to: date1});

        expect(event.value()).toEqual({from: date1, to: date1});
        expect(event.type).toEqual(EventTypes.ADD);

        const subscriber = vi.fn();

        event.subscribe(subscriber);
        event.value({from: date1, to: date2});

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(1);

        const nextSubscriber = vi.fn();

        event.subscribe(nextSubscriber);
        event.value({from: date1, to: date3});
        event.value({from: date1, to: date4});

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(2);
        expect(nextSubscriber).toHaveBeenCalledTimes(1);

        const value = event.value();

        expect(value).toEqual({from: date1, to: date4});
    });

    it('createEventStore: should return an event store', async () => {
        const events = initStateToEvents();
        const store = createEventStore(events);

        expect(store.getState()).toEqual(events);

        const addEvent = createEvent(EventTypes.ADD, {from: date1, to: date1});
        store.publish(addEvent);

        expect(store.getState()).toEqual([{from: date1, to: date1}]);

        const subscriber = vi.fn();
        store.subscribe(subscriber);

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(1);

        addEvent.value({from: date1, to: date2});

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(2);

        addEvent.value({from: date1, to: date3});
        addEvent.value({from: date1, to: date4});

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(3);
        expect(store.getState()).toEqual([{from: date1, to: date4}]);

        const removeEvent1 = createEvent(EventTypes.REMOVE, {from: date1, to: date1});
        store.publish(removeEvent1);

        await flushPromises();

        expect(store.getState()).toEqual([{from: date2, to: date4}]);
        expect(subscriber).toHaveBeenCalledTimes(4);

        const removeEvent2 = createEvent(EventTypes.REMOVE, {from: date4, to: date4});
        store.publish(removeEvent2);

        await flushPromises();

        expect(store.getState()).toEqual([{from: date2, to: date3}]);
        expect(subscriber).toHaveBeenCalledTimes(5);

        store.clear();

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(6);
        expect(store.getState()).toEqual([]);
    })

    it('queryState: should return an event which matches the date range', () => {
        const events = initStateToEvents();
        const store = createEventStore(events);

        const addEvent = createEvent(EventTypes.ADD, {from: date1, to: date1});

        store.publish(addEvent);

        expect(queryState(events, date1)).toEqual({from: date1, to: date1});

        addEvent.value({from: date1, to: date4});

        expect(queryState(events, date1)).toEqual({from: date1, to: date4});
        expect(queryState(events, date2)).toEqual({from: date1, to: date4});

        const removeEvent = createEvent(EventTypes.REMOVE, {from: date2, to: date2});

        store.publish(removeEvent);

        expect(queryState(events, date1)).toEqual({from: date1, to: date4});
        expect(queryState(events, date3)).toEqual({from: date1, to: date4});
        expect(queryState(events, date4)).toEqual({from: date1, to: date4});
        expect(queryState(events, date2)).toEqual(null);
    });

    it('mergeAddEvent: should return meged date ranges', () => {
        const ranges = [
            {from: date2, to: date3},
            {from: date3, to: date4}
        ];

        expect(mergeAddEvent(ranges, {from: date1, to: date1})).toEqual([
            {from: date2, to: date3},
            {from: date3, to: date4},
            {from: date1, to: date1}
        ])

        expect(mergeAddEvent(ranges, {from: date1})).toEqual([{from: date1}]);
        expect(mergeAddEvent(ranges, {from: date3})).toEqual([{from: date2}]);
        expect(mergeAddEvent(ranges, {to: date4})).toEqual([{to: date4}]);
        expect(mergeAddEvent(ranges, {to: date3})).toEqual([{to: date4}]);
        expect(mergeAddEvent(ranges, {from: date1, to: date3})).toEqual([{from: date1, to: date4}])
    });

    it('mergeRemoveEvent: should return meged date ranges', () => {
        const ranges = [
            {from: date1, to: date3}
        ];

        expect(mergeRemoveEvent(ranges, {from: date1})).toEqual([]);
        expect(mergeRemoveEvent(ranges, {from: date2})).toEqual([{from: date1, to: date1}]);
        expect(mergeRemoveEvent(ranges, {from: date3})).toEqual([{from: date1, to: date2}]);
        expect(mergeRemoveEvent(ranges, {to: date4})).toEqual([]);
        expect(mergeRemoveEvent(ranges, {to: date3})).toEqual([]);
        expect(mergeRemoveEvent(ranges, {to: date2})).toEqual([{from: date3, to: date3}]);
        expect(mergeRemoveEvent(ranges, {to: date1})).toEqual([{from: date2, to: date3}]);
    })
});