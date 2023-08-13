import { createEffect } from "./effect";
import { createObservable } from "./observable";

export interface IBus<T> {
    send: (command: T) => void;
    subscribe: (subscriber: (command: T) => void) => () => void;
}

export const createCommandBus = <T>(): IBus<T> => {
    const queue: Set<T> = new Set();

    const observable = createObservable();
    const clearQueue = createEffect(() => queue.clear());

    const send = (command: T) => {
        queue.add(command);
        observable.notify();
    };

    const subscribe = (subscriber: (command: T) => void) => {
        return observable.subscribe(() => {
            queue.forEach((command) => {
                subscriber(command);
            });
            clearQueue();
        });
    };

    return {send, subscribe};
};
