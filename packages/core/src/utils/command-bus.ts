/* eslint-disable no-shadow */
import { createEffect } from "./effect";
import { createObservable } from "./observable";

export interface IBus<T> {
    send: (command: T) => void;
    subscribe: (subscriber: (command: T) => void) => () => void;
}

export enum SharedCommand {
    UPDATE = 'UPDATE'
}

export const createCommandBus = <T>(): IBus<T> => {
	const queue: T[] = [];
	let cursor = 0;

	const observable = createObservable();
	const clearQueue = createEffect(() => {
		queue.splice(cursor + 1);
		cursor = 0;
	});

	const send = (command: T) => {
		queue.push(command);
		observable.notify();
	};

	const subscribe = (subscriber: (command: T) => void) => {
		return observable.subscribe(() => {
			queue.forEach((command, i) => {
				subscriber(command);
				if (cursor < i) cursor = i;
			});
			clearQueue();
		});
	};

	return { send, subscribe };
};
