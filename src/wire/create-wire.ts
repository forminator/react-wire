import { createFnsWire } from '../fn-wire/create-fns-wire';
import { createStateWire } from '../state-wire/create-state-wire';
import { Wire } from './wire';

export function createWire<V>(initialValue: V): Wire<V> {
  const [stateWire] = createStateWire({}, initialValue);
  const [fnsWire] = createFnsWire({});
  return { ...fnsWire, ...stateWire };
}
