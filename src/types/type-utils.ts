/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { IEventStore } from "../utils/event-store";

export type ToCamelCase<T extends string> = T extends `${infer A}_${infer B}${infer C}`
    ? `${Lowercase<A>}${Uppercase<B>}${ToCamelCase<C>}`
    : Lowercase<T>;

export type ActionCreator<T extends any[]> = (...param: T) => void;

export type LastParam<T extends (...args: any) => any> = T extends (a: any, ...b: infer B) => any ? B extends never[] ? Parameters<T> : B : never;

export type Action<T extends (...args: any) => any> = ActionCreator<LastParam<T>>;

export type SimplifyFn<T extends (...args: any) => any> = T extends (...args: infer P) => infer R ? (...args: P) => R : never;

export type Simplify<T> = {
    [K in keyof T]: T[K];
} & {};

export type _BasicControllerAction<T extends (...args: any) => any> = T extends (a: any, ...b: infer B) => infer R
    ? (...param: B) => R
    : never;

export type IsUnknown<T> = unknown extends T ? true : false;

export type BasicControllerAction<T extends (...args: any) => any> = T extends (store: IEventStore, arg1: infer A, arg2: infer B) => infer R
    ? IsUnknown<B> extends false
        ? (from: A | string, to?: NonNullable<B> | string) => R
        : IsUnknown<A> extends false
            ? (date: A | string) => R
            : () => R
    : never;
