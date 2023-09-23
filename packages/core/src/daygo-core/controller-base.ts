/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-rest-params */

import {
	SharedCommand,
	add,
	addAll,
	castDate,
	clear,
	createStore,
	dateToggle,
	initStateToRanges,
	is,
	isValidDateInput,
	remove,
	replace,
	reset
} from "../utils";
import { toValidRange } from "../tools";
import type {
	IBus,
	IStore,
	InitStateDates } from "../utils";
import type { ControllerCommand, CustomParser } from '../types/type';
import type { BasicControllerAction } from '../types/type-utils';

type StoreAction<T> = (store: IStore, ...args: any[]) => T;

export type InitState = {
    readonly initState?: InitStateDates;
    readonly customParser?: CustomParser;
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
	};
};

export const createBaseController = (bus: IBus<ControllerCommand>, init: InitState) => {
	const { customParser } = init;

	const eventStore = createStore(initStateToRanges(init));
	const bind = bindAction(eventStore, customParser);

	eventStore.subscribe(() => bus.send({ type: SharedCommand.UPDATE }));
	return {
		bind,
		is: bind(is),
		add: bind(add),
		reset: bind(reset),
		clear: bind(clear),
		remove: bind(remove),
		addAll: bind(addAll),
		replace: bind(replace),
		toggle: bind(dateToggle),
		getState: eventStore.getState,
		subscribe: eventStore.subscribe
	};
};
