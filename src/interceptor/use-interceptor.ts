import { useState } from 'react';
import { StateWire, WireState } from '../state-wire/state-wire';
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
  const [[interceptedWire, setInterceptor]] = useState(() =>
    createInterceptor<WireState<W>, W>(wire, interceptor),
  );
  setInterceptor(interceptor);
  return interceptedWire;
}
