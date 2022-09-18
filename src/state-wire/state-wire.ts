import { Defined, StrictGuard } from '../utils/type-utils';
import { WireId } from '../utils/wire-id';

export interface StateWireGuard<V> {
  ' state-wire': StrictGuard<V>;
}

export interface StateWire<V> extends StateWireGuard<V>, WireId {
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

export function isWritableStateWire<V = unknown>(
  wire: unknown,
): wire is StateWire<V> {
  return !!(
    wire &&
    (wire as any)[' state-wire'] &&
    (wire as any)[' state-wire'][0] &&
    (wire as any)[' state-wire'][1]
  );
}

export function createStateWireGuard<V>(): StateWireGuard<V> {
  return { ' state-wire': [true /* read */, true /* write */] as any };
}
