/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-rest-params */
import { isInRange } from '../utils/helpers';
import { IEventStore, createEventStore, add, dateToggle, is, remove, replace, reset, DateRange, initStateToEvents } from "../utils/event-store";
import { IBus } from '../utils/command-bus';
import { ControllerCommand } from '../types/type';
import { castDate } from '../utils/common';
import { BasicControllerAction, Simplify } from '../types/type-utils';

export enum SharedCommand {
    UPDATE = 'UPDATE'
}

export type InitState = {
    initState?: Array<Date | DateRange | string>;
    customParser?: (date: string) => Date;
}

const bindAction = (store: IEventStore, customParser?: (date: string) => Date) => {
    return <T, S extends (store: IEventStore, ...args: any[]) => T>(reducer: S): BasicControllerAction<S> => {
        return function () {
            const args = Array.from(arguments).map((arg) => {
                if (!arg) return arg;
                return castDate(arg, customParser);
            });

            return reducer(store, ...args);
        } as BasicControllerAction<S>;
    }
}

export const createBasicController = (bus: IBus<ControllerCommand>, init: InitState) => {
    const {customParser} = init;

    const eventStore = createEventStore(isInRange, initStateToEvents(init));
    const bind = bindAction(eventStore, customParser);

    eventStore.subscribe(() => bus.send({type: SharedCommand.UPDATE}));
    return {
        bind,
        is: bind(is),
        add: bind(add),
        reset: bind(reset),
        remove: bind(remove),
        replace: bind(replace),
        toggle: bind(dateToggle),
        getState: eventStore.getState,
        removeEvent: eventStore.remove,
        publishEvent: eventStore.publish,
        subscribe: eventStore.subscribe
    }
}
