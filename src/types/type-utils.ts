/* eslint-disable @typescript-eslint/no-explicit-any */

export type ToCamelCase<T extends string> = T extends `${infer A}_${infer B}${infer C}`
    ? `${Lowercase<A>}${Uppercase<B>}${ToCamelCase<C>}`
    : Lowercase<T>;

export type ActionCreator<T extends any[]> = (...param: T) => void;

export type LastParam<T extends (...args: any) => any> = T extends (a: any, ...b: infer B) => any ? B extends never[] ? Parameters<T> : B : never;

export type Action<T extends (...args: any) => any> = ActionCreator<LastParam<T>>;

export type Simplify<T extends (...args: any) => any> = T extends (...args: infer P) => infer R ? (...args: P) => R : never;

export type BasicControllerAction<T extends (...args: any) => any> = T extends (a: any, ...b: infer B) => infer R
    ? (...param: B) => R
    : never;
