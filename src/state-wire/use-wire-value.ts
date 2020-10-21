import { useDebugValue, useEffect, useState } from 'react';
import { Defined } from '../utils/type-utils';
import { useStabilityGuard } from '../utils/use-stability-guard';
import { ReadonlyStateWire, WireState } from './readonly-state-wire';

export function useWireValue(
  wire: null | undefined,
  defaultValue?: unknown,
): undefined;
export function useWireValue<W extends ReadonlyStateWire<any>>(
  wire: W,
): WireState<W>;
export function useWireValue<W extends ReadonlyStateWire<any>>(
  wire: W | null | undefined,
  defaultValue: Defined<WireState<W>>,
): Defined<WireState<W>>;
export function useWireValue<W extends ReadonlyStateWire<any>>(
  wire: W,
  defaultValue?: WireState<W> | undefined,
): WireState<W>;
export function useWireValue<W extends ReadonlyStateWire<any>>(
  wire: W | null | undefined,
  defaultValue?: WireState<W>,
): WireState<W> | undefined;
export function useWireValue<W extends ReadonlyStateWire<any>>(
  wire: W | null | undefined,
  defaultValue?: WireState<W>,
): WireState<W> | undefined {
  type Value = WireState<W>;
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
      return wire.subscribe((value) => {
        setStateValue(value);
      });
    }
    // `stateValue` variable only used as initial value
    // eslint-disable-next-line react-app/react-hooks/exhaustive-deps
  }, [wire]);

  return valueToReturn;
}
