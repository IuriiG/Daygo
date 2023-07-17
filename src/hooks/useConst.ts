import { useRef, MutableRefObject } from "react";
import { isFunction } from "../utils/common";

export function useConst<T>(initialState: T | (() => T)): T {
    const ref = useRef<T>(null) as MutableRefObject<T>;

    if (!ref.current) {
        ref.current = isFunction(initialState) ? initialState() : initialState;
    }

    return ref.current;
}
