import { Defined, StrictGuard } from '../utils/type-utils';

export interface StateWireGuard<V> {
  ' state-wire': StrictGuard<V>;
}

export interface StateWire<V> extends StateWireGuard<V> {
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

export function isStateWire<V = unknown>(wire: unknown): wire is StateWire<V> {
  return !!(wire && (wire as any)[' state-wire']);
}

export function createStateWireGuard<V>(): StateWireGuard<V> {
  return { ' state-wire': true as any };
}

export type WireState<W extends StateWire<any>> = W extends StateWire<infer V>
  ? V
  : never;
