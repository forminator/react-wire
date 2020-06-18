import { createFnsWire } from '../fn-wire/create-fns-wire';
import {
  createStateSelector,
  ReadOnlySelectorOptions,
  SelectorOptions,
  WritableSelectorOptions,
} from '../state-selector/create-state-selector';
import { ReadonlyWire, Wire } from '../wire/wire';

export function createSelector<V, Fns = {}>(
  options: WritableSelectorOptions<V>,
): Wire<V, Fns>;
export function createSelector<V, Fns = {}>(
  options: ReadOnlySelectorOptions<V>,
): ReadonlyWire<V, Fns>;
export function createSelector<V, Fns = {}>(
  options: SelectorOptions<V>,
): ReadonlyWire<V, Fns> | Wire<V, Fns> {
  const [fnsWire, connectFnsWire] = createFnsWire<Fns>({});
  const [stateSelector, connectStateSelector] = createStateSelector<V>(options);
  connectFnsWire();
  connectStateSelector();
  return { ...fnsWire, ...stateSelector };
}
