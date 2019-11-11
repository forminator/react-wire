import { useEffect, useState } from 'react';
import { Interceptor } from './interceptor';
import { useWire } from './use-wire';
import { _SetValueInterceptor } from './set-value-interceptor';
import { Wire } from './wire';

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
export function useInterceptor<Value>(
  wire: Wire<Value>,
  interceptor: Interceptor<Value>,
): Wire<Value> {
  const [valueInterceptor] = useState(
    () => new _SetValueInterceptor(wire, interceptor),
  );
  const outputWire = useWire<Value>(valueInterceptor);

  useEffect(() => {
    return valueInterceptor.connect(wire);
  }, [valueInterceptor, wire]);

  useEffect(() => {
    valueInterceptor.setInterceptor(interceptor);
  }, [valueInterceptor, interceptor]);

  return outputWire;
}
