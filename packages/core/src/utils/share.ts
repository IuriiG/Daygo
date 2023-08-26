import { isFunction } from "./common";

export function createShare<T>() {
    let sub: ((v: T) => void) | null;

    const next = (v: T) => {
        if (isFunction(sub)) sub(v);
    };

    const subscribe = (subscriber: (v: T) => void) => {
        sub = subscriber;
        return () => {
            sub = null;
        };
    };

    return { next, subscribe };
}
