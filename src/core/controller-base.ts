/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-rest-params */

import { IEventStore, createEventStore, add, dateToggle, is, remove, replace, clear, DateRange, initStateToEvents } from "../utils/event-store";
import { IBus } from '../utils/command-bus';
import { ControllerCommand, CustomParser } from '../types/type';
import { castDate } from '../utils/common';
import { BasicControllerAction } from '../types/type-utils';

export enum SharedCommand {
    UPDATE = 'UPDATE'
}

type StoreAction<T> = (store: IEventStore, ...args: any[]) => T;

export type InitState = {
    initState?: Array<Date | DateRange | string>;
    customParser?: CustomParser;
}

const bindAction = (store: IEventStore, customParser?: CustomParser) => {
    return <T, S extends StoreAction<T>>(reducer: S): BasicControllerAction<S> => {
        return function () {
            const args = Array.from(arguments).map((arg) => {
                if (!arg) return arg;
                return castDate(arg, customParser);
            });

            return reducer(store, ...args);
        } as BasicControllerAction<S>;
    }
}

export const createBaseController = (bus: IBus<ControllerCommand>, init: InitState) => {
    const {customParser} = init;

    const eventStore = createEventStore(initStateToEvents(init));
    const bind = bindAction(eventStore, customParser);

    eventStore.subscribe(() => bus.send({type: SharedCommand.UPDATE}));
    return {
        bind,
        is: bind(is),
        add: bind(add),
        reset: bind(clear),
        remove: bind(remove),
        replace: bind(replace),
        toggle: bind(dateToggle),
        getState: eventStore.getState,
        removeEvent: eventStore.remove,
        publishEvent: eventStore.publish,
        subscribe: eventStore.subscribe
    }
}
