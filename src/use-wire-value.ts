import { useDebugValue, useEffect, useState } from 'react';
import { Subscribable } from './subscribable';

/**
 *
 * returns wire value and subscribe to wire for value updates
 *
 * @param wire
 *
 * @remarks
 * please always pass same wire param and avoid changing wire param, it can cause strange behavior and bad intermediate values
 *
 */
export function useWireValue<Value>(
  wire: Subscribable<Value> | null | undefined,
): Value | undefined;
/**
 *
 * returns wire value and subscribe to wire for value updates
 *
 * @param wire
 * @param defaultValue - return value if wire value is undefined
 *
 * @remarks
 *
 * please always pass same wire param and avoid changing wire param, it can cause strange behavior and bad intermediate values
 *
 */
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
