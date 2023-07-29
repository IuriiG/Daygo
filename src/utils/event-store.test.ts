import { toDate } from './date';
import {
    is,
    add,
    remove,
    dateToggle,
    replace,
    clear,
    initStateToEvents,
    createEvent,
    EventTypes,
    createEventStore,
    queryState,
    mergeAddEvent,
    mergeRemoveEvent,
    excludeState,
    getRange,
    IEvent,
    flatState
} from './event-store';
import { flushPromises } from './test-utils';

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

        const addEvent1 = createEvent(EventTypes.ADD, {from: date5, to: date5});

        store.publish(addEvent1);
        expect(store.getState()).toEqual([{from: date5, to: date5}]);

        store.remove(addEvent1);
        expect(store.getState()).toEqual([]);

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(7);
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
        expect(queryState(events, date5)).toEqual(null);
        expect(queryState(events, date6)).toEqual(null);
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
        expect(mergeRemoveEvent(ranges, {from: date1, to: date1})).toEqual([{from: date2, to: date3}]);
        expect(mergeRemoveEvent(ranges, {from: date1, to: date2})).toEqual([{from: date3, to: date3}]);
        expect(mergeRemoveEvent(ranges, {from: date2, to: date2})).toEqual([{from: date1, to: date1}, {from: date3, to: date3}]);
    });

    it('excludeState', () => {
        const selected = [
            {from: date1, to: date3},
            {from: date4, to: date6}
        ];

        const disabled = [
            {from: date2, to: date4},
            {from: date6, to: date6}
        ]

        expect(excludeState(selected, disabled)).toEqual([
            {from: date1, to: date1},
            {from: date5, to: date5}
        ])
    });

    it('getRange', () => {
        const range1 = {from: date1};
        const range2 = {to: date2};
        const range3 = {from: date3, to: date4};

        expect(getRange(range1)).toEqual([date1.getTime(), Infinity]);
        expect(getRange(range2)).toEqual([-Infinity, date2.getTime()]);
        expect(getRange(range3)).toEqual([date3.getTime(), date4.getTime()]);
    });

    it('flatState', () => {
        const events: IEvent[] = [
            createEvent(EventTypes.ADD, {from: date1, to: date2}),
            createEvent(EventTypes.ADD, {from: date2, to: date3}),
            createEvent(EventTypes.ADD, {from: date3, to: date4}),
            createEvent(EventTypes.ADD, {from: date4, to: date5}),
            createEvent(EventTypes.ADD, {from: date5, to: date6})
        ];

        expect(flatState(events)).toEqual([{from: date1, to: date6}]);

        events.push(createEvent(EventTypes.REMOVE, {from: date2, to: date2}));
        events.push(createEvent(EventTypes.REMOVE, {from: date4, to: date5}));

        expect(flatState(events)).toEqual([{from: date1, to: date1}, {from: date3, to: date3}, {from: date6, to: date6}]);

        events.push(createEvent(EventTypes.ADD, {from: date1, to: date5}));

        expect(flatState(events)).toEqual([{from: date6, to: date6}, {from: date1, to: date5}]);

        const events2: IEvent[] = [createEvent(EventTypes.ADD)];

        expect(flatState(events2)).toEqual([]);
    });

    it('is', () => {
        const store = createEventStore([]);
        store.publish(createEvent(EventTypes.ADD, {from: date1, to: date1}));

        expect(is(store, date1)).toEqual(true);
        expect(is(store, date2)).toEqual(false);
        expect(is(store, date3)).toEqual(false);

        store.publish(createEvent(EventTypes.REMOVE, {from: date1, to: date1}));
        store.publish(createEvent(EventTypes.ADD, {from: date2, to: date2}));

        expect(is(store, date1)).toEqual(false);
        expect(is(store, date2)).toEqual(true);
        expect(is(store, date3)).toEqual(false);
    });

    it('add', () => {
        const store = createEventStore([]);
        add(store, date1);

        expect(store.getState()).toEqual([{from: date1, to: date1}]);

        add(store, date1, date2);

        expect(store.getState()).toEqual([{from: date1, to: date2}]);

        add(store, date5, date6);

        expect(store.getState()).toEqual([{from: date1, to: date2}, {from: date5, to: date6}]);
    });

    it('remove', () => {
        const store = createEventStore([]);
        store.publish(createEvent(EventTypes.ADD, {from: date1, to: date1}));

        expect(store.getState()).toEqual([{from: date1, to: date1}]);

        remove(store, date1);

        expect(store.getState()).toEqual([]);

        store.publish(createEvent(EventTypes.ADD, {from: date2, to: date2}));
        store.publish(createEvent(EventTypes.ADD, {from: date4, to: date4}));
        store.publish(createEvent(EventTypes.ADD, {from: date6, to: date6}));

        expect(store.getState()).toEqual([{from: date2, to: date2}, {from: date4, to: date4}, {from: date6, to: date6}]);

        remove(store, date4, date6);

        expect(store.getState()).toEqual([{from: date2, to: date2}]);

        remove(store, date1, date6);

        expect(store.getState()).toEqual([]);
    });

    it('replace', () => {
        const store = createEventStore([]);
        replace(store, date1);

        expect(store.getState()).toEqual([{from: date1, to: date1}]);

        replace(store, date1, date2);

        expect(store.getState()).toEqual([{from: date1, to: date2}]);

        replace(store, date5, date6);

        expect(store.getState()).toEqual([{from: date5, to: date6}]);
    });

    it('dateToggle', () => {
        const store = createEventStore([]);

        dateToggle(store, date1);
        expect(store.getState()).toEqual([{from: date1, to: date1}]);

        dateToggle(store, date1);
        expect(store.getState()).toEqual([]);

        dateToggle(store, date2);
        expect(store.getState()).toEqual([{from: date2, to: date2}]);

        dateToggle(store, date2);
        expect(store.getState()).toEqual([]);
    });

    it('clear', () => {
        const store = createEventStore([]);

        store.publish(createEvent(EventTypes.ADD, {from: date1, to: date1}));
        store.publish(createEvent(EventTypes.ADD, {from: date2, to: date2}));
        store.publish(createEvent(EventTypes.ADD, {from: date3, to: date3}));

        clear(store);

        expect(store.getState()).toEqual([]);
    })
});