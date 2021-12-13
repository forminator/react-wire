import { useCallback, useDebugValue } from 'react';
import shim from 'use-sync-external-store/shim';
import { Defined } from '../utils/type-utils';
import { ReadonlyStateWire, WireState } from './readonly-state-wire';

const { useSyncExternalStore } = shim;

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

  const subscribe: (onStoreChange: () => void) => () => void = useCallback(
    (fn) => wire?.subscribe(() => fn()) ?? (() => {}),
    [wire],
  );
  const getSnapshot: () => Value | undefined = useCallback(
    () => wire?.getValue(),
    [wire],
  );
  const stateValue = useSyncExternalStore<Value | undefined>(
    subscribe,
    getSnapshot,
  );
  const valueToReturn = stateValue === undefined ? defaultValue : stateValue;
  useDebugValue(valueToReturn);
  return valueToReturn;
}
