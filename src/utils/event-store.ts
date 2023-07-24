import { castDate, isDate, isString } from "./common";
import { addDay, subtractDay } from "./date";
import { isInRange, rangeOf } from "./helpers";
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

export function createEventStore(init: IEvent[]): IEventStore {
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

    const query = (date: Date) => queryState(events, date);

    const getState = () => flatState(events);

    return {clear, remove, query, publish, subscribe, getState}
}

export function queryState(events: IEvent[], date: Date) {
    for (let i = events.length - 1; i >= 0; i--) {
        const event = events[i];
        const value = event.value();

        if (value && isInRange(date, value)) {
            return event.type === EventTypes.ADD ? value : null;
        }
    }

    return null;
}

export function flatState(events: IEvent[]): DateRange[] {
    return events.reduce((acc, event) => {
        const value = event.value();

        if (!value) return acc;

        if (event.type === EventTypes.ADD) {
            return mergeAddEvent(acc, value);
        }

        return mergeRemoveEvent(acc, value);
    }, [] as DateRange[]);
}

export function mergeAddEvent(events: DateRange[], event: DateRange): DateRange[] {
    const [start, end] = getRange(event);
    const mergedEvents: DateRange[] = [];
    let newStart = start;
    let newEnd = end;

    for (const eachEvent of events) {
        const [from, to] = getRange(eachEvent);

        if (start > to || end < from) {
            mergedEvents.push(eachEvent);
            continue;
        }

        newStart = Math.min(newStart, from);
        newEnd = Math.max(newEnd, to);
    }

    mergedEvents.push({
        from: numberToDate(newStart),
        to: numberToDate(newEnd)
    });

    return mergedEvents;
}

export function mergeRemoveEvent(events: DateRange[], event: DateRange): DateRange[] {
    const [start, end] = getRange(event);
    const res: DateRange[] = [];

    for (const eachEvent of events) {
        const [from, to] = getRange(eachEvent);

        if (end < from || to < start) {
            res.push(eachEvent);
            continue;
        }

        if (start > from && to < end) {
            continue;
        }

        if (from < start && start <= to) {
            res.push({
                from: numberToDate(from),
                to: numberToDate(start, subtractDay)
            });
        }

        if (from <= end && end < to) {
            res.push({
                from: numberToDate(end, addDay),
                to: numberToDate(to)
            });
        }
    }

    return res;
}

export function excludeState (targetState: DateRange[], exclude: DateRange[]) {
    return exclude.reduce(mergeRemoveEvent, targetState);
}

export function getRange(eventRange: DateRange) {
    const {from, to} = rangeOf(eventRange.from, eventRange.to);
    return [
        from?.getTime() ?? -Infinity,
        to?.getTime() ?? Infinity
    ]
}

export function numberToDate(date: number, modificator?: (date: Date) => Date) {
    return Number.isFinite(date)
        ? modificator ? modificator(new Date(date)) : new Date(date)
        : undefined
}
