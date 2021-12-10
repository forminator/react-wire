import { useEffect, useRef } from 'react';
import { Defined, isDefined } from '../utils/type-utils';
import { ReadonlyStateWire } from './readonly-state-wire';

export function useSubscribe<V>(
  wire: ReadonlyStateWire<V>,
  callback: (value: Defined<V>) => void,
): void {
  let lastValueRef = useRef(wire.getValue());
  useEffect(() => {
    let value = wire.getValue();
    if (isDefined(value) && value !== lastValueRef.current) {
      callback(value);
      lastValueRef.current = value;
    }
    return wire.subscribe(callback);
  }, [wire, callback]);
}
