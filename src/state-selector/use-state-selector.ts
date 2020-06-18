import { useEffect, useState } from 'react';
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
  const [[selector, connect]] = useState(() => {
    return createStateSelector<V>(options);
  });
  useEffect(() => {
    return connect();
  }, [connect]);

  return selector;
}
