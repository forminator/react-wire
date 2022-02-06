import { CovarianceGuard, Defined } from '../utils/type-utils';
import { WireId } from '../utils/wire-id';

export interface ReadonlyStateWireGuard<V> {
  ' state-wire': CovarianceGuard<V>;
}

export interface ReadonlyStateWire<V>
  extends ReadonlyStateWireGuard<V>,
    WireId {
  /**
   * get current value
   * @returns current value
   */
  getValue(): V;

  /**
   * subscribe for value change
   * @param callback
   * @returns unsubscribe function
   */
  subscribe(callback: (value: Defined<V>) => void): () => void;
}

export function isReadonlyStateWire<V = unknown>(
  wire: unknown,
): wire is ReadonlyStateWire<V> {
  return !!(
    wire &&
    (wire as any)[' state-wire'] &&
    (wire as any)[' state-wire'][0]
  );
}

export function createReadonlyStateWireGuard<V>(): ReadonlyStateWireGuard<V> {
  return { ' state-wire': [true /* read */, false /* write */] as any };
}

export type WireState<
  W extends ReadonlyStateWire<any>
> = W extends ReadonlyStateWire<infer V> ? V : never;
