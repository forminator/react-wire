import { useEffect, useRef, useState } from 'react';
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
): StateWire<V>;
export function useStateSelector<V>(
  options: ReadOnlySelectorOptions<V>,
): ReadonlyStateWire<V>;
export function useStateSelector<V>(
  options: SelectorOptions<V>,
): ReadonlyStateWire<V> | StateWire<V> {
  const [[selector, connect], set] = useState(() => {
    return createStateSelector<V>(options);
  });
  const lastOptions = useRef(options);

  useEffect(() => {
    if (lastOptions.current !== options) {
      lastOptions.current = options;
      set(createStateSelector<V>(options));
    }
    // fast refresh support:
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    return connect();
  }, [connect]);
  return selector;
}
