import { useMemo } from 'react';
import { useFnsWire } from '../fn-wire/use-fns-wire';
import { useStateWire } from '../state-wire/use-state-wire';
import { InitializerOrValue } from '../utils/is-initializer';
import { Wire } from './wire';

export function useWire<V, Fns = {}>(upLink: Wire<V, Fns>): Wire<V, Fns>;
export function useWire<V, Fns = {}>(
  upLink: Wire<V | undefined, Fns> | null | undefined,
  initialValue: InitializerOrValue<V>,
): Wire<V, Fns>;
export function useWire<V, Fns = {}>(
  upLink: Wire<V, Fns> | null | undefined,
  initialValue: InitializerOrValue<V>,
): Wire<V, Fns>;
export function useWire<V, Fns = {}>(
  upLink: Wire<V, Fns> | null | undefined,
  initialValue?: InitializerOrValue<V | undefined>,
): Wire<V | undefined, Fns>;
export function useWire<V, Fns = {}>(
  upLink: Wire<V | undefined, Fns> | null | undefined,
  initialValue?: InitializerOrValue<V | undefined>,
): Wire<V | undefined, Fns> | Wire<V, Fns> {
  const fnsWire = useFnsWire(upLink);
  const stateWire = useStateWire(upLink, initialValue);

  return useMemo(() => ({ ...fnsWire, ...stateWire }), [fnsWire, stateWire]);
}
