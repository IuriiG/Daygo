import { useRef } from "react";
import { isFunction } from "@daygo/core";
import type { MutableRefObject } from "react";

export function useConst<T>(initialState: T | (() => T)): T {
	const ref = useRef<T>(null) as MutableRefObject<T>;

	if (!ref.current) {
		ref.current = isFunction(initialState) ? initialState() : initialState;
	}

	return ref.current;
}
