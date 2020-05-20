/**
 * connect react components with wire
 *
 * @packageDocumentation
 */

import { Dispatch } from 'react';
import { SetStateAction } from 'react';

declare type CB<T> = (t: T) => void;

declare type Defined<T> = T extends undefined ? never : T;

export declare interface FnsWire<Fns extends {}> extends FnsWireGuard<Fns> {
  fn: <K extends KeyOfMethods<Fns>>(name: K, value: Fns[K]) => () => void;
  fns: Methods<Fns>;
}

declare interface FnsWireGuard<Fns> {
  /**
   * @internal
   * Covariance hack:
   * never use this variable.
   * don't remove space at the start
   */
  ' fns-wire': StrictMethodsGuard<Fns>;
}

declare type InitializerOrValue<V> = V | (() => V);

export declare type Interceptor<Value> = (
  nextValue: Defined<Value>,
  preValue: Value,
) => Value | undefined;

declare type IsNever<T> = [T] extends [never] ? true : false;

declare type KeyOfMethods<T> = NonNever<keyof Methods<T>>;

declare type MethodKeys<T> = {
  [P in keyof T]: T[P] extends Function ? P : never;
}[keyof T];

declare type Methods<T> = Pick<T, MethodKeys<T>>;

declare type NonNever<T> = IsNever<T> extends true ? any : T;

export declare interface StateWire<V> extends StateWireGuard<V> {
  /**
   * get current value
   * @returns current value
   */
  getValue(): V;
  /**
   * set value
   * @param value
   */
  setValue(value: Defined<V>): void;
  /**
   * subscribe for value change
   * @param callback
   * @returns unsubscribe function
   */
  subscribe(callback: (value: Defined<V>) => void): () => void;
}

declare interface StateWireGuard<V> {
  ' state-wire': StrictGuard<V>;
}

declare type StrictGuard<T> = [T, CB<T>];

declare type StrictMethodsGuard<Fns> = {
  [P in keyof Methods<Fns>]: StrictGuard<Fns[P]>;
};

/**
 *
 * subscribe for function calls
 *
 * @param wire
 * @param name - name of `fns` function
 * @param fn - memoized callback function
 *
 * @example
```ts
 // subscribe for `sample` function call
 useFn(
 wire,
 'sample',
 useCallback(value => {
    console.log(value);
  }, []),
 );

 // call `sample` function
 wire.fns.sample(5);
```
 */
export declare function useFn<Fns, K extends KeyOfMethods<Fns>>(
  wire: FnsWire<Fns>,
  name: K,
  fn: Fns[K],
): void;

/**
 * returns new wire and intercepting setValue of returned wire
 *
 * @param wire - up-link wire
 * @param interceptor - interceptor function
 * @returns new intercepted wire
 *
 * @remarks
 *
 * the interceptor function gets the next value and previous value and returns a value. the returned value be set on
 * up-link wire.
 * if interceptor function returns `undefined` or the same value as previous value, up-link wire value will not change.
 *
 * @example
 *
 * ```tsx
 * const valueWire = useInterceptor(
 *   props.valueWire,
 *   useCallback(
 *     (nextValue, preValue) => (props.submittingWire.getValue() ? preValue : nextValue),
 *     [props.submittingWire]
 *   )
 * );
 * ```
 *
 */
export declare function useInterceptor<W extends StateWire<any>>(
  wire: W,
  interceptor: Interceptor<WireState<W>>,
): W;

export declare function useWire<V, Fns = {}>(
  upLink: Wire<V, Fns>,
): Wire<V, Fns>;

export declare function useWire<V, Fns = {}>(
  upLink: Wire<V | undefined, Fns> | null | undefined,
  initialValue: InitializerOrValue<V>,
): Wire<V, Fns>;

export declare function useWire<V, Fns = {}>(
  upLink: Wire<V, Fns> | null | undefined,
  initialValue: InitializerOrValue<V>,
): Wire<V, Fns>;

export declare function useWire<V, Fns = {}>(
  upLink: Wire<V, Fns> | null | undefined,
  initialValue?: InitializerOrValue<V | undefined>,
): Wire<V | undefined, Fns>;

export declare function useWireState<V>(
  upLink: StateWire<V>,
): valueAndAction<V>;

export declare function useWireState<V>(
  wire: StateWire<V | undefined> | null | undefined,
  initialValue: InitializerOrValue<V>,
): valueAndAction<V>;

export declare function useWireState<V>(
  wire: StateWire<V> | null | undefined,
  initialValue: InitializerOrValue<V>,
): valueAndAction<V>;

export declare function useWireState<V>(
  wire: StateWire<V> | null | undefined,
  initialValue?: InitializerOrValue<V | undefined>,
): valueAndAction<V | undefined>;

export declare function useWireValue(
  wire: null | undefined,
  defaultValue?: unknown,
): undefined;

export declare function useWireValue<W extends StateWire<any>>(
  wire: W,
): WireState<W>;

export declare function useWireValue<W extends StateWire<any>>(
  wire: W | null | undefined,
  defaultValue: Defined<WireState<W>>,
): Defined<WireState<W>>;

export declare function useWireValue<W extends StateWire<any>>(
  wire: W,
  defaultValue?: WireState<W> | undefined,
): WireState<W>;

export declare function useWireValue<W extends StateWire<any>>(
  wire: W | null | undefined,
  defaultValue?: WireState<W>,
): WireState<W> | undefined;

declare type valueAndAction<V> = [V, Dispatch<SetStateAction<Defined<V>>>];

export declare type Wire<V, Fns = {}> = StateWire<V> & FnsWire<Fns>;

export declare type WireFns<W extends FnsWire<any>> = W extends FnsWire<
  infer Fns
>
  ? Fns
  : never;

export declare type WireState<W extends StateWire<any>> = W extends StateWire<
  infer V
>
  ? V
  : never;

export {};
