/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-rest-params */

import {
    is,
    add,
    IBus,
    clear,
    addAll,
    remove,
    IStore,
    replace,
    castDate,
    DateRange,
    dateToggle,
    createStore,
    isValidDateInput,
    initStateToRanges
} from "../utils";
import { ControllerCommand, CustomParser } from '../types/type';
import { BasicControllerAction } from '../types/type-utils';
import { toValidRange } from "../tools";

export enum SharedCommand {
    UPDATE = 'UPDATE'
}

type StoreAction<T> = (store: IStore, ...args: any[]) => T;

export type InitState = {
    initState?: Array<Date | DateRange | string>;
    customParser?: CustomParser;
}

export const bindAction = (store: IStore, customParser?: CustomParser) => {
    return <T, S extends StoreAction<T>>(reducer: S): BasicControllerAction<S> => {
        return function () {
            const args = Array.from(arguments).map((arg) => {
                try {
                    return isValidDateInput(arg)
                        ? castDate(arg, customParser)
                        : toValidRange(arg, customParser);
                } catch (_) {
                    return arg;
                }
            });

            return reducer(store, ...args);
        } as BasicControllerAction<S>;
    }
}

export const createBaseController = (bus: IBus<ControllerCommand>, init: InitState) => {
    const {customParser} = init;

    const eventStore = createStore(initStateToRanges(init));
    const bind = bindAction(eventStore, customParser);

    eventStore.subscribe(() => bus.send({type: SharedCommand.UPDATE}));
    return {
        bind,
        is: bind(is),
        add: bind(add),
        reset: bind(clear),
        remove: bind(remove),
        addAll: bind(addAll),
        replace: bind(replace),
        toggle: bind(dateToggle),
        getState: eventStore.getState,
        subscribe: eventStore.subscribe
    }
}
