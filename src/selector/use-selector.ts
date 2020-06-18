import { useMemo } from 'react';
import { useFnsWire } from '../fn-wire/use-fns-wire';
import {
  ReadOnlySelectorOptions,
  SelectorOptions,
  WritableSelectorOptions,
} from '../state-selector/create-state-selector';
import { useStateSelector } from '../state-selector/use-state-selector';
import { ReadonlyWire, Wire } from '../wire/wire';

export function useSelector<V, Fns = {}>(
  options: WritableSelectorOptions<V>,
): Wire<V, Fns>;
export function useSelector<V, Fns = {}>(
  options: ReadOnlySelectorOptions<V>,
): ReadonlyWire<V, Fns>;
export function useSelector<V, Fns = {}>(
  options: SelectorOptions<V>,
): ReadonlyWire<V, Fns> | Wire<V, Fns> {
  const fnsWire = useFnsWire<Fns>(null);
  const selector = useStateSelector<V>(options);
  return useMemo(() => ({ ...fnsWire, ...selector }), [fnsWire, selector]);
}
