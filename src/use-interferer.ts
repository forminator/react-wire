import { useEffect, useState } from 'react';
import { Interferer } from './Interferer';
import { useWire } from './use-wire';
import { _SetValueInterferer } from './set-value-Interferer';
import { Wire } from './wire';

/**
 * returns new wire and interfering setValue of returned wire
 *
 * @param wire - up-link wire
 * @param interferer - interferer function
 * @returns new interfered wire
 *
 * @remarks
 *
 * the interferer function gets the next value and previous value and returns a value. the returned value be set on
 * up-link wire.
 * if interferer function returns `undefined` or the same value as previous value, up-link wire value will not change.
 *
 * @example
 *
 * ```tsx
 * const valueWire = useInterferer(
 *   props.valueWire,
 *   useCallback(
 *     (nextValue, preValue) => (props.submittingWire.getValue() ? preValue : nextValue),
 *     [props.submittingWire]
 *   )
 * );
 * ```
 *
 */
export function useInterferer<Value>(
  wire: Wire<Value>,
  interferer: Interferer<Value>,
): Wire<Value> {
  const [valueInterferer] = useState(
    () => new _SetValueInterferer(wire, interferer),
  );
  const outputWire = useWire<Value>(valueInterferer);

  useEffect(() => {
    return valueInterferer.connect(wire);
  }, [valueInterferer, wire]);

  useEffect(() => {
    valueInterferer.setInterferer(interferer);
  }, [valueInterferer, interferer]);

  return outputWire;
}
