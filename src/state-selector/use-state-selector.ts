import { DependencyList, useEffect, useRef, useState } from 'react';
import { ReadonlyStateWire } from '../state-wire/readonly-state-wire';
import { StateWire } from '../state-wire/state-wire';
import {
  createStateSelector,
  ReadOnlySelectorOptions,
  SelectorOptions,
  WritableSelectorOptions,
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
    reconnect && reconnect(options);
    // eslint-disable-next-line
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
