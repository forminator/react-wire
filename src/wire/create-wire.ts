import { createFnsWire } from '../fn-wire/create-fns-wire';
import { createStateWire } from '../state-wire/create-state-wire';
import { Wire } from './wire';

export function createWire<V, Fns = {}>(initialValue: V): Wire<V, Fns> {
  const [stateWire] = createStateWire<V>({}, initialValue);
  const [fnsWire] = createFnsWire<Fns>({});
  return { ...fnsWire, ...stateWire };
}
