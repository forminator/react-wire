import { useCallback, useDebugValue, useSyncExternalStore } from 'react';
import type { Defined } from '../utils/type-utils';
import type { ReadonlyStateWire, WireState } from './readonly-state-wire';

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
  const getServerSnapshot: () => Value | undefined = useCallback(
    () => wire?.getValue(),
    [wire],
  );
  const stateValue = useSyncExternalStore<Value | undefined>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const valueToReturn = stateValue === undefined ? defaultValue : stateValue;
  useDebugValue(valueToReturn);
  return valueToReturn;
}
