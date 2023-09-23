import { invoke } from "./common";
import { createEffect } from "./effect";

export type Subscribe = (subscriber: () => void) => () => void;

export type Observable = {
    notify(): void;
    subscribe: Subscribe;
}

export const createObservable = (): Observable => {
	const subscribers: Set<() => void> = new Set();

	const notify = createEffect(() => {
		subscribers.forEach(invoke);
	});

	const subscribe = (subscriber: () => void) => {
		subscribers.add(subscriber);
		return () => {
			subscribers.delete(subscriber);
		};
	};

	return { notify, subscribe };
};
