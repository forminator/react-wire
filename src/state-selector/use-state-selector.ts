import { type DependencyList, useEffect, useRef, useState } from 'react';
import type { ReadonlyStateWire } from '../state-wire/readonly-state-wire';
import type { StateWire } from '../state-wire/state-wire';
import {
  createStateSelector,
  type ReadOnlySelectorOptions,
  type SelectorOptions,
  type WritableSelectorOptions,
} from './create-state-selector';

export function useStateSelector<V>(
  options: WritableSelectorOptions<V>,
  deps?: DependencyList,
): StateWire<V>;
export function useStateSelector<V>(
  options: ReadOnlySelectorOptions<V>,
  deps?: DependencyList,
): ReadonlyStateWire<V>;
export function useStateSelector<V>(
  options: SelectorOptions<V>,
  deps: DependencyList = [],
): ReadonlyStateWire<V> | StateWire<V> {
  const [[selector, connect]] = useState(() => {
    return createStateSelector<V>(options);
  });

  const reconnectRef = useRef<ReturnType<typeof connect> | null>(null);

  useEffect(() => {
    const reconnect = reconnectRef.current;
    reconnect?.(options);
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const reconnect = connect();
    reconnectRef.current = reconnect;
    return () => {
      reconnect();
      reconnectRef.current = null;
    };
  }, [connect]);

  return selector;
}
