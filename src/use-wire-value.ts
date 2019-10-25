import { useDebugValue, useEffect, useState } from 'react';
import { Subscribable } from './subscribable';

export function useWireValue<Value>(
  wire: Subscribable<Value> | null | undefined,
): Value | undefined;
export function useWireValue<Value>(
  wire: Subscribable<Value> | null | undefined,
  defaultValue: Value,
): Value | undefined;
export function useWireValue<Value>(
  wire: Subscribable<Value> | null | undefined,
  defaultValue?: Value,
): Value | undefined {
  const [stateValue, setStateValue] = useState<Value | undefined>(() =>
    wire ? wire.getValue() : undefined,
  );
  useDebugValue(stateValue);
  useEffect(() => {
    if (wire) {
      const wireValue = wire.getValue();
      if (wireValue !== stateValue) {
        setStateValue(wireValue);
      }
      return wire.subscribe(value => {
        setStateValue(value);
      });
    } else {
      if (stateValue !== undefined) {
        setStateValue(undefined);
      }
    }
    // `stateValue` variable only used as initial value
    // eslint-disable-next-line react-app/react-hooks/exhaustive-deps
  }, [wire]);

  return stateValue === undefined ? defaultValue : stateValue;
}
