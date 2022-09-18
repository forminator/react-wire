import { DependencyList, useMemo } from 'react';
import { useFnsWire } from '../fn-wire/use-fns-wire';
import {
  ReadOnlySelectorOptions,
  SelectorOptions,
  WritableSelectorOptions,
} from '../state-selector/create-state-selector';
import { useStateSelector } from '../state-selector/use-state-selector';
import { ReadonlyWire, Wire } from '../wire/wire';

export function useSelector<V, Fns extends {} = {}>(
  options: WritableSelectorOptions<V>,
  deps?: DependencyList,
): Wire<V, Fns>;
export function useSelector<V, Fns extends {} = {}>(
  options: ReadOnlySelectorOptions<V>,
  deps?: DependencyList,
): ReadonlyWire<V, Fns>;
export function useSelector<V, Fns extends {} = {}>(
  options: SelectorOptions<V>,
  deps?: DependencyList,
): ReadonlyWire<V, Fns> | Wire<V, Fns> {
  const fnsWire = useFnsWire<Fns>(null);
  const selector = useStateSelector<V>(options, deps);
  return useMemo(() => ({ ...fnsWire, ...selector }), [fnsWire, selector]);
}
