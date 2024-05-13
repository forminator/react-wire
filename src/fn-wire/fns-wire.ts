import { KeyOfMethods, Methods, StrictMethodsGuard } from '../utils/type-utils';

export interface FnsWireGuard<Fns> {
  /**
   * @internal
   * Covariance hack:
   * never use this variable.
   * don't remove space at the start
   */
  ' fns-wire': StrictMethodsGuard<Fns>; // Covariance hack
}

export interface FnsWire<Fns extends {}> extends FnsWireGuard<Fns> {
  fn: <K extends KeyOfMethods<Fns>>(name: K, value: Fns[K]) => () => void;
  fns: Methods<Fns>;
}

export function isFnsWire<Fns extends {} = {}>(
  wire: unknown,
): wire is FnsWire<Fns> {
  return !!(wire && (wire as any)[' fns-wire']);
}

export function createFnsWireGuard<Fns>(): FnsWireGuard<Fns> {
  return { ' fns-wire': true as any };
}

export type WireFns<W extends FnsWire<any>> =
  W extends FnsWire<infer Fns> ? Fns : never;
