/**
 * connect react components with wire
 *
 * @packageDocumentation
 */

import { DependencyList } from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

declare type CB<T> = (t: T) => void;

declare type CovarianceGuard<T> = [T, unknown];

export declare function createSelector<V, Fns extends {} = {}>(
  options: WritableSelectorOptions<V>,
): Wire<V, Fns>;

export declare function createSelector<V, Fns extends {} = {}>(
  options: ReadOnlySelectorOptions<V>,
): ReadonlyWire<V, Fns>;

export declare function createWire<V, Fns extends {} = {}>(
  initialValue: V,
): Wire<V, Fns>;

export declare type Defined<T> = T extends undefined ? never : T;

declare type Fn = (...args: any) => any;

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

export declare function getLinkIds(wire: undefined): undefined;

export declare function getLinkIds(wire: WireId): LinkIds;

export declare function getLinkIds(
  wire: WireId | undefined,
): LinkIds | undefined;

export declare function getWireId(wire: undefined): undefined;

export declare function getWireId(wire: WireId): string;

export declare function getWireId(wire: WireId | undefined): string | undefined;

declare type GetWireValue = <V>(wire: ReadonlyStateWire<V>) => V;

declare type InitializerOrValue<V> = V | (() => V);

export declare type Interceptor<Value> = (
  nextValue: Defined<Value>,
  preValue: Value,
) => Value | undefined;

/**
 * isDefined check if the value is undefined or not.
 * it helps with typescript generic types.
 * @param value -
 */
export declare const isDefined: <V>(
  value: V | undefined,
) => value is Defined<V>;

declare type IsNever<T> = [T] extends [never] ? true : false;

declare type KeyOfMethods<T> = NonNever<keyof Methods<T>>;

export declare type LinkIds = Array<string | LinkIds>;

declare type MethodKeys<T> = {
  [P in keyof T]: T[P] extends Fn ? P : never;
}[keyof T];

declare type Methods<T> = Pick<T, MethodKeys<T>>;

declare type NonNever<T> = IsNever<T> extends true ? any : T;

export declare interface ReadOnlySelectorOptions<V> {
  get: (options: { get: GetWireValue }) => V;
}

export declare interface ReadonlyStateWire<V>
  extends ReadonlyStateWireGuard<V>,
    WireId {
  /**
   * get current value
   * @returns current value
   */
  getValue(): V;
  /**
   * subscribe for value change
   * @param callback -
   * @returns unsubscribe function
   */
  subscribe(callback: (value: Defined<V>) => void): () => void;
}

declare interface ReadonlyStateWireGuard<V> {
  ' state-wire': CovarianceGuard<V>;
}

export declare type ReadonlyWire<
  V,
  Fns extends {} = {},
> = ReadonlyStateWire<V> & FnsWire<Fns>;

declare type SetWireValue = <V>(wire: StateWire<V>, value: Defined<V>) => void;

export declare interface StateWire<V> extends StateWireGuard<V>, WireId {
  /**
   * get current value
   * @returns current value
   */
  getValue(): V;
  /**
   * set value
   * @param value -
   */
  setValue(value: Defined<V>): void;
  /**
   * subscribe for value change
   * @param callback -
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
 * @param wire -
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
export declare function useFn<Fns extends {}, K extends KeyOfMethods<Fns>>(
  wire: FnsWire<Fns> | null | undefined,
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

export declare function useSelector<V, Fns extends {} = {}>(
  options: WritableSelectorOptions<V>,
  deps?: DependencyList,
): Wire<V, Fns>;

export declare function useSelector<V, Fns extends {} = {}>(
  options: ReadOnlySelectorOptions<V>,
  deps?: DependencyList,
): ReadonlyWire<V, Fns>;

export declare function useSubscribe<V>(
  wire: ReadonlyStateWire<V>,
  callback: (value: Defined<V>) => void,
): void;

export declare function useWire<V, Fns extends {} = {}>(
  upLink: Wire<V, Fns>,
): Wire<V, Fns>;

export declare function useWire<V, Fns extends {} = {}>(
  upLink: Wire<V | undefined, Fns> | null | undefined,
  initialValue: InitializerOrValue<V>,
): Wire<V, Fns>;

export declare function useWire<V, Fns extends {} = {}>(
  upLink: Wire<V, Fns> | null | undefined,
  initialValue: InitializerOrValue<V>,
): Wire<V, Fns>;

export declare function useWire<V, Fns extends {} = {}>(
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

export declare function useWireValue<W extends ReadonlyStateWire<any>>(
  wire: W,
): WireState<W>;

export declare function useWireValue<W extends ReadonlyStateWire<any>>(
  wire: W | null | undefined,
  defaultValue: Defined<WireState<W>>,
): Defined<WireState<W>>;

export declare function useWireValue<W extends ReadonlyStateWire<any>>(
  wire: W,
  defaultValue?: WireState<W> | undefined,
): WireState<W>;

export declare function useWireValue<W extends ReadonlyStateWire<any>>(
  wire: W | null | undefined,
  defaultValue?: WireState<W>,
): WireState<W> | undefined;

declare type valueAndAction<V> = [V, Dispatch<SetStateAction<Defined<V>>>];

export declare type Wire<V, Fns extends {} = {}> = StateWire<V> & FnsWire<Fns>;

export declare type WireFns<W extends FnsWire<any>> =
  W extends FnsWire<infer Fns> ? Fns : never;

export declare interface WireId {
  /**
   * @internal
   */
  _getId(): string;
  /**
   * @internal
   */
  _getLinkIds(): LinkIds;
}

export declare type WireState<W extends ReadonlyStateWire<any>> =
  W extends ReadonlyStateWire<infer V> ? V : never;

export declare interface WritableSelectorOptions<V> {
  get: (options: { get: GetWireValue }) => V;
  set: (
    options: {
      get: GetWireValue;
      set: SetWireValue;
    },
    value: V,
  ) => void;
}

export {};
