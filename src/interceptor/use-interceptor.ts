import { useRef, useState } from 'react';
import { WireState } from '../state-wire/readonly-state-wire';
import { StateWire } from '../state-wire/state-wire';
import { useIsomorphicLayoutEffect } from '../utils/use-isomorphic-layout-effect';
import { createInterceptor } from './create-interceptor';
import { Interceptor } from './interceptor';

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
export function useInterceptor<W extends StateWire<any>>(
  wire: W,
  interceptor: Interceptor<WireState<W>>,
): W {
  const [[interceptedWire, setInterceptor], set] = useState(() =>
    createInterceptor<WireState<W>, W>(wire, interceptor),
  );
  const lastWireRef = useRef(wire);
  useIsomorphicLayoutEffect(() => {
    if (lastWireRef.current !== wire) {
      lastWireRef.current = wire;
      set(createInterceptor<WireState<W>, W>(wire, interceptor));
    }
  }, [wire, interceptor]);
  setInterceptor(interceptor);
  return interceptedWire;
}
