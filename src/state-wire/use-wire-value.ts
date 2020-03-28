import { useDebugValue, useEffect, useState } from 'react';
import { useStabilityGuard } from '../utils/use-stability-guard';
import { StateWire } from './state-wire';

/**
 *
 * returns wire value and subscribe to wire for value updates
 *
 * @param wire
 *
 * @remarks
 * please always pass same wire param and avoid changing wire param. if wire argument changed, an error will be thrown.
 *
 */
export function useWireValue<Value>(
  wire: StateWire<Value> | null | undefined,
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
 * please always pass same wire param and avoid changing wire param. if wire argument changed, an error will be thrown.
 *
 */
export function useWireValue<Value>(
  wire: StateWire<Value> | null | undefined,
  defaultValue: Value,
): Value | undefined;
export function useWireValue<Value>(
  wire: StateWire<Value> | null | undefined,
  defaultValue?: Value,
): Value | undefined {
  useStabilityGuard(wire);
  const wireValue = wire?.getValue();
  const valueToReturn = wireValue === undefined ? defaultValue : wireValue;
  useDebugValue(valueToReturn);
  const [stateValue, setStateValue] = useState<Value | undefined>(wireValue);
  useEffect(() => {
    if (wire) {
      const wireValue = wire.getValue();
      if (wireValue !== stateValue) {
        setStateValue(wireValue);
      }
      return wire.subscribe(value => {
        setStateValue(value);
      });
    }
    // `stateValue` variable only used as initial value
    // eslint-disable-next-line react-app/react-hooks/exhaustive-deps
  }, [wire]);

  return valueToReturn;
}
