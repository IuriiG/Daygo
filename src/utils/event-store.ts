import { castDate, isDate, isString } from "./common";
import { addDay, subtractDay } from "./date";
import { rangeOf } from "./helpers";
import { Subscribe, createObservable } from "./observable";

export enum EventTypes {
    ADD = 'ADD',
    REMOVE = 'REMOVE'
}

export type DateRange = {
    from?: Date;
    to?: Date;
};

export interface IEventStore {
    clear(): void;
    getState(): DateRange[];
    query(date: Date): DateRange | null;
    remove(event: IEvent): void;
    publish(event: IEvent): void;
    subscribe: Subscribe;
}

export function is(store: IEventStore, date: Date): boolean {
    return Boolean(store.query(date));
}

export function add(store: IEventStore, from: Date, to?: Date): void {
    const event = createEvent(EventTypes.ADD, {from, to: to || from});
    store.publish(event);
}

export function replace(store: IEventStore, from: Date, to?: Date): void {
    reset(store);
    add(store, from, to);
}

export function remove(store: IEventStore, from: Date, to?: Date): void {
    const event = createEvent(EventTypes.REMOVE, {from, to: to || from});
    store.publish(event);
}

export function dateToggle(store: IEventStore, date: Date): void {
    if (is(store, date)) {
        remove(store, date);
        return
    }

    add(store, date);
}

export function reset(store: IEventStore) {
    store.clear();
}

export type EventValueGet = () => DateRange;
export type EventValueSet = (v: DateRange) => void;
export type EventValue = EventValueGet & EventValueSet;

export interface IEvent {
    type: EventTypes;
    value: EventValue;
    subscribe: Subscribe;
}

export type EventStoreInit = {
    initState?: Array<Date | DateRange | string>;
    customParser?: (date: string) => Date;
}

export function createEvent(type: EventTypes, data?: DateRange): IEvent {
    const {subscribe, notify} = createObservable();

    const value = (updateData?: DateRange) => {
        if (!updateData) return data;
        data = updateData;
        notify();
    };

    return {type, value, subscribe} as IEvent
}

export function initStateToEvents(init?: EventStoreInit): IEvent[] {
    const {initState, customParser} = init || {};

    if (!Array.isArray(initState)) return []
    return initState.map((item) => {
        if (isString(item) || isDate(item)) {
            const date = castDate(item, customParser);
            return createEvent(EventTypes.ADD, {from: date, to: date});
        }

        return createEvent(EventTypes.ADD, item);
    });
}

export function createEventStore(comparator: (date: Date, value: DateRange) => boolean, init: IEvent[]): IEventStore {
    const {notify, subscribe} = createObservable();
    let events: IEvent[] = init;

    const clear = () => {
        events = [];
        notify();
    };

    const publish = (event: IEvent) => {
        event.subscribe(notify);
        events.push(event);
        notify();
    };

    const remove = (event: IEvent) => {
        publish(createEvent(EventTypes.REMOVE, event.value()));
    };

    const query = (date: Date) => {
        for (let i = events.length - 1; i >=0; i--) {
            const event = events[i];
            const value = event.value();

            if (!value) continue;

            if (comparator(date, value)) {
                return event.type === EventTypes.ADD ? value : null;
            }
        }

        return null;
    };

    const getState = () => events.reduce((acc, event) => {
            const value = event.value();

            if (!value) return acc;

            if (event.type === EventTypes.ADD) {
                return mergeAddEvent(acc, value)
            }

            return mergeRemoveEvent(acc, value)
        }, [] as DateRange[]);

    return {clear, remove, query, publish, subscribe, getState}
}

function mergeAddEvent(events: DateRange[], event: DateRange): DateRange[] {
    let [start, end] = getRange(event);

    const res = events.reduce((acc, eachEvent) => {
        const [from, to] = getRange(eachEvent);

        if (start > to || end < from) {
            acc.push(eachEvent);
            return acc;
        }

        if (from <= start && start <= to) {
            end = Math.max(to, end); 
        }

        if (from <= end && end <= to) {
            start = Math.min(start, from);
        }

        return acc;
    }, [] as DateRange[]);

    res.push({
        from: numberToDate(start),
        to: numberToDate(end)
    });

    return res;
}

function mergeRemoveEvent(events: DateRange[], event: DateRange): DateRange[] {
    const [start, end] = getRange(event);

    const res = events.reduce((acc, eachEvent) => {
        const [from, to] = getRange(eachEvent);

        if (start > to || end < from) {
            acc.push(eachEvent);
            return acc;
        }

        if (start > from && to < end) {
            return acc;
        }

        if (from < start && start <= to) {
            acc.push({
                from: numberToDate(from),
                to: numberToDate(start, subtractDay)
            });
        }

        if (from <= end && end < to) {
            acc.push({
                from: numberToDate(end, addDay),
                to: numberToDate(to)
            });
        }

        return acc;
    }, [] as DateRange[]);

    return res;
}

function getRange(eventRange: DateRange) {
    const {from, to} = rangeOf(eventRange.from, eventRange.to);
    return [
        from?.getTime() ?? -Infinity,
        to?.getTime() ?? Infinity
    ]
}

function numberToDate(date: number, modificator?: (date: Date) => Date) {
    return Number.isFinite(date)
        ? modificator ? modificator(new Date(date)) : new Date(date)
        : undefined
}