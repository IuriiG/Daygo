import { toDate } from './date';
import {initStateToEvents, createEvent, EventTypes, createEventStore} from './event-store';
import { flushPromises } from './test-utils';

describe('Event-store', () => {
    it('initStateToEvents: should return an array of events', () => {
        const today = toDate(new Date());
        const todayEvent = createEvent(EventTypes.ADD, {from: today, to: today});

        const date1 = '2023-01-01';
        const date2 = '2023-01-02';
        const date3 = '2023-01-03';
        const date4 = '2023-01-04';

        expect(initStateToEvents()).toEqual([]);
        expect(initStateToEvents({})).toEqual([]);
        expect(initStateToEvents({initState: []})).toEqual([]);

        const [event] = initStateToEvents({initState: [{from: today, to: today}]});

        expect(event.value()).toEqual(todayEvent.value());

        const [dateEvent] = initStateToEvents({initState: [today]});

        expect(dateEvent.value()).toEqual(todayEvent.value());

        const [event1, event2] = initStateToEvents({initState: [date1, date2]});

        expect(event1.value()).toEqual({from: toDate(date1), to: toDate(date1)});
        expect(event2.value()).toEqual({from: toDate(date2), to: toDate(date2)});

        const customParser = vi.fn((date: string) => toDate(date));

        expect(initStateToEvents({customParser})).toEqual([]);

        const [event3, event4] = initStateToEvents({initState: [date3, date4], customParser});

        expect(event3.value()).toEqual({from: toDate(date3), to: toDate(date3)});
        expect(event4.value()).toEqual({from: toDate(date4), to: toDate(date4)});

        expect(customParser).toHaveBeenCalled();
        expect(customParser).toHaveBeenCalledTimes(2);
        expect(customParser).toHaveBeenCalledWith(date3);
        expect(customParser).toHaveBeenCalledWith(date4);
        expect(customParser).toHaveReturnedWith(toDate(date3));
        expect(customParser).toHaveReturnedWith(toDate(date4));
    });

    it('createEvent: should return an event', async () => {
        const today = toDate(new Date());

        const date1 = '2023-01-01';
        const date2 = '2023-01-02';
        const date3 = '2023-01-03';
        const date4 = '2023-01-04';

        const event = createEvent(EventTypes.ADD, {from: today, to: today});

        expect(event.value()).toEqual({from: today, to: today});
        expect(event.type).toEqual(EventTypes.ADD);

        const subscriber = vi.fn();

        event.subscribe(subscriber);
        event.value({from: today, to: toDate(date1)});

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(1);

        const nextSubscriber = vi.fn();

        event.subscribe(nextSubscriber);
        event.value({from: today, to: toDate(date2)});
        event.value({from: today, to: toDate(date3)});
        event.value({from: today, to: toDate(date4)});

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(2);
        expect(nextSubscriber).toHaveBeenCalledTimes(1);

        const value = event.value();

        expect(value).toEqual({from: today, to: toDate(date4)});
    });

    it('createEventStore: should return an event store', async () => {
        const date1 = '2023-01-01';
        const date2 = '2023-01-02';
        const date3 = '2023-01-03';
        const date4 = '2023-01-04';

        const events = initStateToEvents();
        const store = createEventStore(events);

        expect(store.getState()).toEqual(events);

        const addEvent = createEvent(EventTypes.ADD, {from: toDate(date1), to: toDate(date1)});
        store.publish(addEvent);

        expect(store.getState()).toEqual([{from: toDate(date1), to: toDate(date1)}]);

        const subscriber = vi.fn();
        store.subscribe(subscriber);

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(1);

        addEvent.value({from: toDate(date1), to: toDate(date2)});

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(2);

        addEvent.value({from: toDate(date1), to: toDate(date3)});
        addEvent.value({from: toDate(date1), to: toDate(date4)});

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(3);
        expect(store.getState()).toEqual([{from: toDate(date1), to: toDate(date4)}]);

        const removeEvent1 = createEvent(EventTypes.REMOVE, {from: toDate(date1), to: toDate(date1)});
        store.publish(removeEvent1);

        await flushPromises();

        expect(store.getState()).toEqual([{from: toDate(date2), to: toDate(date4)}]);
        expect(subscriber).toHaveBeenCalledTimes(4);

        const removeEvent2 = createEvent(EventTypes.REMOVE, {from: toDate(date4), to: toDate(date4)});
        store.publish(removeEvent2);

        await flushPromises();

        expect(store.getState()).toEqual([{from: toDate(date2), to: toDate(date3)}]);
        expect(subscriber).toHaveBeenCalledTimes(5);

        store.clear();

        await flushPromises();

        expect(subscriber).toHaveBeenCalledTimes(6);
    })
})