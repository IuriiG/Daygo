import { toRange } from "../tools";
import { castDate, isDate, isString } from "./common";
import { addDay, subtractDay } from "./date";
import { isInRange, rangeOf } from "./helpers";
import { Subscribe, createObservable } from "./observable";

export type DateRange = {
    from?: Date;
    to?: Date;
};

export interface IStore {
    clear(): void;
    subscribe: Subscribe;
    getState(): DateRange[];
    query(date: Date): boolean;
    remove(range: DateRange): void;
    publish(range: DateRange): void;
}

export function is(store: IStore, date: Date): boolean {
    return Boolean(store.query(date));
}

export function add(store: IStore, date: Date | DateRange): void {
    const range = isDate(date) ? toRange(date) : date;
    store.publish(range);
}

export function remove(store: IStore, date: Date | DateRange): void {
    const range = isDate(date) ? toRange(date) : date;
    store.remove(range);
}

export function dateToggle(store: IStore, date: Date): void {
    if (is(store, date)) {
        remove(store, date);
        return
    }

    add(store, date);
}

export function clear(store: IStore) {
    store.clear();
}

export function replace(store: IStore, range: Date | DateRange): void {
    clear(store);
    add(store, range);
}

export type EventStoreInit = {
    initState?: Array<Date | DateRange | string>;
    customParser?: (date: string) => Date;
}

export function initStateToRanges(init?: EventStoreInit): DateRange[] {
    const {initState, customParser} = init || {};

    if (!Array.isArray(initState)) return []
    return initState.map((item) => {
        if (isString(item) || isDate(item)) {
            const date = castDate(item, customParser);
            return toRange(date);
        }

        return item;
    });
}

export function createStore(init: DateRange[]): IStore {
    const {notify, subscribe} = createObservable();
    let state: DateRange[] = init;

    const publish = (dateRange: DateRange) => {
        state = push(state, dateRange);
        notify();
    };

    const remove = (dateRange: DateRange) => {
        state = pop(state, dateRange);
        notify();
    };

    const clear = () => {
        state = [];
        notify();
    };

    const query = (date: Date) => includes(state, date);

    const getState = () => sort(state);

    return {publish, query, remove, clear, getState, subscribe};
}

export function push(ranges: DateRange[], range: DateRange): DateRange[] {
    const [start, end] = getRange(range);
    const mergedRanges: DateRange[] = [];
    let newStart = start;
    let newEnd = end;

    for (const eachRange of ranges) {
        const [from, to] = getRange(eachRange);

        if (start > to || end < from) {
            mergedRanges.push(eachRange);
            continue;
        }

        newStart = Math.min(newStart, from);
        newEnd = Math.max(newEnd, to);
    }

    mergedRanges.push({
        from: numberToDate(newStart),
        to: numberToDate(newEnd)
    });

    return mergedRanges;
}

export function pop(events: DateRange[], event: DateRange): DateRange[] {
    const [start, end] = getRange(event);
    const res: DateRange[] = [];

    for (const eachEvent of events) {
        const [from, to] = getRange(eachEvent);

        if (end < from || to < start) {
            res.push(eachEvent);
            continue;
        }

        if (start < from && to < end) {
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
    return exclude.reduce(pop, targetState);
}

export function sort (state: DateRange[]) {
    return state.sort((a, b) => {
        const [fromA, toA] = getRange(a);
        const [fromB, toB] = getRange(b);

        if (fromA > fromB) return 1;
        if (fromA < fromB) return -1;
        if (toA > toB) return 1;
        if (toA < toB) return -1;   
        return 0;
    });
}

export function includes (state: DateRange[], date: Date) {
    return state.some((item) => isInRange(date, item));
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
